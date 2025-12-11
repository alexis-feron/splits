import Image from "next/image";
import Link from "next/link";
import {
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
  isChampionClinched,
} from "../utils/standingsUtils";

interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  code: string;
}

interface Constructor {
  constructorId: string;
  name: string;
}

interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

async function getDriverStandings(): Promise<DriverStanding[]> {
  const currentYear = new Date().getFullYear();
  const url =
    "https://api.jolpi.ca/ergast/f1/" + currentYear + "/driverstandings/";

  const response = await fetch(url, {
    next: { revalidate: 43200 }, // Cache pour 12 heures
  });

  const data = await response.json();
  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
}

export default async function DriverStandings() {
  const currentYear = new Date().getFullYear();
  const standings = await getDriverStandings();

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
        Driver Standings {currentYear}
      </h1>
      <div className="overflow-x-auto">
        {/* En-tête du tableau */}
        <div className="hidden md:grid grid-cols-[auto_auto_1fr_auto] gap-4 px-4 py-3 mb-2 text-sm font-semibold text-gray-600 uppercase">
          <div className="w-12 text-center">Pos</div>
          <div className="w-14">Nat.</div>
          <div>Driver / Team</div>
          <div className="text-right">Points / Wins</div>
        </div>
        <div className="space-y-3 md:space-y-4 p-1">
          {standings.map((driver, index) => {
            const currentTeam =
              driver.Constructors[driver.Constructors.length - 1];
            const teamColor = getConstructorColor(currentTeam?.constructorId);
            const isChampion = index === 0 && isLeaderChampion;

            return (
              <Link
                key={driver.Driver.driverId}
                href={`/drivers/${driver.Driver.driverId}`}
                className="block overflow-visible"
                aria-label={`View details for ${driver.Driver.givenName} ${driver.Driver.familyName}`}
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
                      {driver.position}
                    </div>

                    {/* Drapeau du pilote */}
                    {getNationalityFlag(driver.Driver.nationality) && (
                      <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-lg">
                        <Image
                          src={getNationalityFlag(driver.Driver.nationality)!}
                          alt={driver.Driver.nationality}
                          width={47}
                          height={47}
                          className="object-cover rounded shadow-md"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Info du pilote */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-1 md:gap-2">
                        <h3 className="font-bold text-sm md:text-lg truncate">
                          {driver.Driver.givenName}{" "}
                          <span className="uppercase">
                            {driver.Driver.familyName}
                          </span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2">
                        {/* Logo de l'équipe */}
                        <div
                          className="flex-shrink-0 w-4 h-4 md:w-6 md:h-6 relative rounded-md p-0.5 md:p-1"
                          style={{
                            background: `linear-gradient(135deg, ${teamColor.primary}40, ${teamColor.secondary}40)`,
                          }}
                        >
                          <Image
                            src={getConstructorLogo(currentTeam?.constructorId)}
                            alt={currentTeam?.name}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                          {currentTeam?.name}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 text-right">
                      <div
                        className="font-bold text-xl md:text-2xl"
                        style={{ color: teamColor.primary }}
                      >
                        {driver.points}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 md:mt-1 whitespace-nowrap">
                        {driver.wins}{" "}
                        {parseInt(driver.wins) === 1 ? "win" : "wins"}
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
