import Image from "next/image";
import {
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
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

  return (
    <div className="w-full max-w-5xl mx-auto lg:px-24 px-2 pb-4">
      <h1 className="text-3xl font-bold text-center mb-6">
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
        <div className="space-y-3">
          {standings.map((driver) => {
            const currentTeam =
              driver.Constructors[driver.Constructors.length - 1];
            const teamColor = getConstructorColor(currentTeam?.constructorId);

            return (
              <div
                key={driver.Driver.driverId}
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
                    {driver.position}
                  </div>

                  {/* Drapeau du pilote */}
                  {getNationalityFlag(driver.Driver.nationality) && (
                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center  rounded-lg">
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
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">
                        {driver.Driver.givenName}{" "}
                        <span className="uppercase">
                          {driver.Driver.familyName}
                        </span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {/* Logo de l'équipe */}
                      <div
                        className="flex-shrink-0 w-6 h-6 relative rounded p-1"
                        style={{
                          background: `linear-gradient(135deg, ${teamColor.primary}30, ${teamColor.secondary}30)`,
                        }}
                      >
                        <Image
                          src={getConstructorLogo(currentTeam?.constructorId)}
                          alt={currentTeam?.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {currentTeam?.name}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 text-right">
                    <div
                      className="font-bold text-2xl"
                      style={{ color: teamColor.primary }}
                    >
                      {driver.points}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {driver.wins}{" "}
                      {parseInt(driver.wins) === 1 ? "win" : "wins"}
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
