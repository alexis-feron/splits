import Image from "next/image";
import {
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
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

  return (
    <div className="w-full max-w-5xl mx-auto lg:px-24 px-2 pb-4">
      <h1 className="text-3xl font-bold text-center mb-6">
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
        <div className="space-y-3">
          {standings.map((constructor) => {
            const teamColor = getConstructorColor(
              constructor.Constructor.constructorId
            );

            return (
              <div
                key={constructor.Constructor.constructorId}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                style={{ borderLeftColor: teamColor.primary }}
              >
                <div className="flex items-center p-4 gap-4">
                  {/* Position */}
                  <div
                    className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl"
                    style={{
                      backgroundColor: teamColor.primary,
                      color: "white",
                    }}
                  >
                    {constructor.position}
                  </div>

                  {/* Logo de l'équipe avec fond couleur équipe */}
                  <div
                    className="flex-shrink-0 w-14 h-14 relative rounded-lg p-2 shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${teamColor.primary}30, ${teamColor.secondary}30)`,
                    }}
                  >
                    <Image
                      src={getConstructorLogo(
                        constructor.Constructor.constructorId
                      )}
                      alt={constructor.Constructor.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Info de l'équipe */}
                  <div className="flex-grow flex items-center gap-2">
                    {getNationalityFlag(
                      constructor.Constructor.nationality
                    ) && (
                      <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
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
                    <h3 className="font-bold text-lg">
                      {constructor.Constructor.name}
                    </h3>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 text-right">
                    <div
                      className="font-bold text-2xl"
                      style={{ color: teamColor.primary }}
                    >
                      {constructor.points}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {constructor.wins}{" "}
                      {parseInt(constructor.wins) === 1 ? "win" : "wins"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
