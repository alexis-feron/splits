import Image from "next/image";
import Link from "next/link";
import {
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
  isChampionClinched,
} from "../utils/standingsUtils";

interface Constructor {
  constructorId: string;
  name: string;
  nationality: string;
}

interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

async function getConstructorStandings(): Promise<ConstructorStanding[]> {
  const currentYear = new Date().getFullYear();
  const url =
    "https://api.jolpi.ca/ergast/f1/" + currentYear + "/constructorstandings/";

  const response = await fetch(url, {
    next: { revalidate: 43200 }, // Cache pour 12 heures
  });

  const data = await response.json();
  return (
    data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ||
    []
  );
}

export default async function ConstructorStandings() {
  const currentYear = new Date().getFullYear();
  const standings = await getConstructorStandings();

  // Vérifier si le leader est champion mathématique
  let isLeaderChampion = false;
  if (standings.length >= 2) {
    const leaderPoints = parseFloat(standings[0].points);
    const secondPoints = parseFloat(standings[1].points);
    isLeaderChampion = await isChampionClinched(
      leaderPoints,
      secondPoints,
      currentYear
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto xl:px-20 lg:px-12 md:px-4 px-0 pb-4">
      <h1 className="hidden lg:block text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">
        Constructor Standings {currentYear}
      </h1>
      <div className="overflow-x-auto">
        {/* En-tête du tableau */}
        <div className="hidden md:grid grid-cols-[auto_auto_1fr_auto] gap-4 px-4 py-3 mb-2 text-sm font-semibold text-gray-600 uppercase">
          <div className="w-12 text-center">Pos</div>
          <div className="w-14">Logo</div>
          <div>Constructor</div>
          <div className="text-right">Points / Wins</div>
        </div>
        <div className="space-y-3 md:space-y-4 p-1">
          {standings.map((constructor, index) => {
            const teamColor = getConstructorColor(
              constructor.Constructor.constructorId
            );
            const isChampion = index === 0 && isLeaderChampion;

            return (
              <Link
                key={constructor.Constructor.constructorId}
                href={`/constructors/${constructor.Constructor.constructorId}`}
                className="block overflow-visible"
                aria-label={`View details for ${constructor.Constructor.name}`}
              >
                <div
                  className="rounded-lg shadow-md hover:shadow-lg hover:scale-x-101 transition-shadow duration-300 cursor-pointer border-l-4"
                  style={{
                    borderLeftColor: teamColor.primary,
                    background: isChampion
                      ? "linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)"
                      : "white",
                  }}
                >
                  <div className="flex items-center p-2 md:p-4 gap-2 md:gap-4">
                    {/* Position */}
                    <div
                      className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full font-bold text-lg md:text-xl"
                      style={{
                        backgroundColor: teamColor.primary,
                        color: "white",
                      }}
                    >
                      {constructor.position}
                    </div>

                    {/* Logo de l'équipe avec fond couleur équipe */}
                    <div
                      className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 relative rounded-xl p-1 md:p-2 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${teamColor.primary}40, ${teamColor.secondary}40)`,
                      }}
                    >
                      <Image
                        src={getConstructorLogo(
                          constructor.Constructor.constructorId
                        )}
                        alt={constructor.Constructor.name}
                        fill
                        className="object-contain p-0.5 md:p-1"
                      />
                    </div>

                    {/* Info de l'équipe */}
                    <div className="flex-grow flex items-center gap-1 md:gap-2 min-w-0">
                      {getNationalityFlag(
                        constructor.Constructor.nationality
                      ) && (
                        <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={
                              getNationalityFlag(
                                constructor.Constructor.nationality
                              )!
                            }
                            alt={constructor.Constructor.nationality}
                            width={24}
                            height={16}
                            className="object-contain rounded shadow-sm"
                            unoptimized
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-sm md:text-lg truncate">
                        {constructor.Constructor.name}
                      </h3>
                    </div>

                    {/* Points */}
                    <div className="flex-shrink-0 text-right">
                      <div
                        className="font-bold text-xl md:text-2xl"
                        style={{ color: teamColor.primary }}
                      >
                        {constructor.points}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 md:mt-1 whitespace-nowrap">
                        {constructor.wins}{" "}
                        {parseInt(constructor.wins) === 1 ? "win" : "wins"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
