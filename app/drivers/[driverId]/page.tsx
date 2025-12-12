import {
  calculateAge,
  calculatePodiums,
  formatDate,
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
  getPositionColor,
} from "@/app/standings/utils/standingsUtils";
import Image from "next/image";
import Link from "next/link";

interface DriverInfo {
  driverId: string;
  permanentNumber?: string;
  code: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  url: string;
}

interface RaceResult {
  season: string;
  round: string;
  raceName: string;
  date: string;
  position: string;
  points: string;
  grid: string;
  FastestLap?: {
    rank: string;
    Time: {
      time: string;
    };
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
}

interface DriverStanding {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
  };
}

interface PageProps {
  params: Promise<{ driverId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { driverId } = await params;
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/drivers/${driverId}.json`,
      { next: { revalidate: 43200 } }
    );
    const data = await response.json();
    const driver = data.MRData?.DriverTable?.Drivers?.[0];

    if (driver) {
      return {
        title: `${driver.givenName} ${driver.familyName} - Splits F1`,
        description: `Discover statistics and results for ${driver.givenName} ${driver.familyName} for the current season.`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "F1 Driver - Splits",
    description: "Statistics and results of an F1 driver",
  };
}

async function getDriverDetails(driverId: string, year: number) {
  try {
    const [driverInfoRes, resultsRes, standingsRes] = await Promise.all([
      fetch(`https://api.jolpi.ca/ergast/f1/drivers/${driverId}.json`, {
        next: { revalidate: 43200 },
      }),
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverId}/results.json`,
        {
          next: { revalidate: 43200 },
        }
      ),
      fetch(`https://api.jolpi.ca/ergast/f1/${year}/driverstandings/`, {
        next: { revalidate: 43200 },
      }),
    ]);

    if (!driverInfoRes.ok || !resultsRes.ok) {
      throw new Error("Impossible de récupérer les données du pilote");
    }

    const driverInfoData = await driverInfoRes.json();
    const resultsData = await resultsRes.json();
    const standingsData = await standingsRes.json();

    const driverInfo: DriverInfo | null =
      driverInfoData.MRData?.DriverTable?.Drivers?.[0] || null;
    const results: RaceResult[] =
      resultsData.MRData?.RaceTable?.Races?.flatMap(
        (race: {
          season: string;
          round: string;
          raceName: string;
          date: string;
          Results?: RaceResult[];
        }) =>
          race.Results?.map((result) => ({
            ...result,
            season: race.season,
            round: race.round,
            raceName: race.raceName,
            date: race.date,
          })) || []
      ) || [];

    const standings: DriverStanding[] =
      standingsData.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.DriverStandings || [];
    const driverStanding = standings.find(
      (s) => s.Driver.driverId === driverId
    );

    if (!driverInfo) {
      throw new Error("Driver not found");
    }

    return {
      driverInfo,
      results,
      standing: driverStanding,
    };
  } catch (error) {
    console.error("Error fetching driver data:", error);
    throw error;
  }
}

export default async function DriverDetailPage({ params }: PageProps) {
  const { driverId } = await params;
  const currentYear = new Date().getFullYear();
  const { driverInfo, results, standing } = await getDriverDetails(
    driverId,
    currentYear
  );

  const currentTeam = results.length > 0 ? results[0].Constructor : null;
  const teamColor = currentTeam
    ? getConstructorColor(currentTeam.constructorId)
    : { primary: "#000000", secondary: "#FFFFFF" };

  const constructorId = currentTeam?.constructorId || "";

  const podiums = calculatePodiums(results);
  const age = calculateAge(driverInfo.dateOfBirth);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Link
        href="/standings#driver-standings"
        className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Standings
      </Link>

      {/* Hero Section */}
      <div
        className="rounded-2xl shadow-lg p-6 md:p-8 mb-8"
        style={{
          background: `linear-gradient(135deg, ${teamColor.primary}15, ${teamColor.secondary}15)`,
          borderLeft: `6px solid ${teamColor.primary}`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Flag */}
          {getNationalityFlag(driverInfo.nationality) && (
            <div className="flex-shrink-0 w-32 h-auto md:w-40 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
              <Image
                src={getNationalityFlag(driverInfo.nationality)!}
                alt={driverInfo.nationality}
                width={320}
                height={213}
                className="object-contain w-full h-auto"
                unoptimized
              />
            </div>
          )}

          {/* Main info */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start gap-2 md:gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl font-bold">
                {driverInfo.givenName}{" "}
                <span className="uppercase">{driverInfo.familyName}</span>
              </h1>
              {driverInfo.permanentNumber && (
                <div
                  className="text-lg md:text-xl font-bold px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: teamColor.primary,
                    color: "white",
                  }}
                >
                  #{driverInfo.permanentNumber}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600">
              <span className="text-xl font-semibold">{driverInfo.code}</span>
              <span>•</span>
              <span>{driverInfo.nationality}</span>
              {currentTeam && (
                <>
                  <span>•</span>
                  <Link
                    href={`/constructors/${constructorId}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-8 h-8 relative rounded p-1"
                      style={{
                        background: `linear-gradient(135deg, ${teamColor.primary}40, ${teamColor.secondary}40)`,
                      }}
                    >
                      <Image
                        src={getConstructorLogo(constructorId)}
                        alt={currentTeam.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span className="font-semibold">{currentTeam.name}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div
            className="text-3xl font-bold"
            style={{ color: teamColor.primary }}
          >
            {standing?.position || "N/A"}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Position {currentYear}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div
            className="text-3xl font-bold"
            style={{ color: teamColor.primary }}
          >
            {standing?.points || "0"}
          </div>
          <div className="text-sm text-gray-600 mt-1">Points</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div
            className="text-3xl font-bold"
            style={{ color: teamColor.primary }}
          >
            {standing?.wins || "0"}
          </div>
          <div className="text-sm text-gray-600 mt-1">Wins</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div
            className="text-3xl font-bold"
            style={{ color: teamColor.primary }}
          >
            {podiums}
          </div>
          <div className="text-sm text-gray-600 mt-1">Podiums</div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Date of Birth:</span>
            <span className="ml-2 font-semibold">
              {formatDate(driverInfo.dateOfBirth)} ({age} years old)
            </span>
          </div>
          <div>
            <span className="text-gray-600">Nationality:</span>
            <span className="ml-2 font-semibold">{driverInfo.nationality}</span>
          </div>
          {driverInfo.permanentNumber && (
            <div>
              <span className="text-gray-600">Permanent Number:</span>
              <span className="ml-2 font-semibold">
                #{driverInfo.permanentNumber}
              </span>
            </div>
          )}
          <div>
            <a
              href={driverInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 gap-2 hover:text-red-800 underline inline-flex items-center"
            >
              Learn more on Wikipedia
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Season Results */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">
          {currentYear} Season Results
        </h2>
        {results.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No results available for this season.
          </p>
        ) : (
          <>
            {/* Desktop version - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr className="text-left">
                    <th className="py-3 px-4">Round</th>
                    <th className="py-3 px-4">Grand Prix</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Grid</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Points</th>
                    <th className="py-3 px-4">Fastest Lap</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={`${result.round}-${index}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold">
                        {result.round}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/events/${result.round}`}
                          className="hover:underline hover:text-blue-600 transition-colors"
                        >
                          {result.raceName}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(result.date)}
                      </td>
                      <td className="py-3 px-4">{result.grid}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPositionColor(
                            result.position
                          )}`}
                        >
                          {result.position}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold">{result.points}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {result.FastestLap?.rank === "1" ? (
                          <span className="text-purple-600 font-semibold">
                            {result.FastestLap.Time.time}
                          </span>
                        ) : (
                          result.FastestLap?.Time?.time || "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile version - Cards */}
            <div className="md:hidden space-y-4">
              {results.map((result, index) => (
                <div
                  key={`${result.round}-${index}`}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        href={`/events/${result.round}`}
                        className="font-bold text-lg hover:underline hover:text-blue-600 transition-colors"
                      >
                        {result.raceName}
                      </Link>
                      <div className="text-sm text-gray-600">
                        Round {result.round} • {formatDate(result.date)}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getPositionColor(
                        result.position
                      )}`}
                    >
                      P{result.position}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div>
                      <span className="text-gray-600">Grid:</span>
                      <span className="ml-1 font-semibold">{result.grid}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Points:</span>
                      <span className="ml-1 font-semibold">
                        {result.points}
                      </span>
                    </div>
                  </div>
                  {result.FastestLap && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Fastest Lap:</span>
                      <span
                        className={`ml-1 ${
                          result.FastestLap.rank === "1"
                            ? "text-purple-600 font-semibold"
                            : ""
                        }`}
                      >
                        {result.FastestLap.Time?.time}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
