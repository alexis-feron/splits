import {
  calculatePodiums,
  formatDate,
  getConstructorColor,
  getConstructorLogo,
  getNationalityFlag,
  getPositionColor,
} from "@/app/standings/utils/standingsUtils";
import Image from "next/image";
import Link from "next/link";

interface ConstructorInfo {
  constructorId: string;
  name: string;
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
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
  };
}

interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
  };
}

interface PageProps {
  params: Promise<{ constructorId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { constructorId } = await params;
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/constructors/${constructorId}.json`,
      { next: { revalidate: 43200 } }
    );
    const data = await response.json();
    const constructor = data.MRData?.ConstructorTable?.Constructors?.[0];

    if (constructor) {
      return {
        title: `${constructor.name} - Splits F1`,
        description: `Discover statistics and results for ${constructor.name} team for the current season.`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "F1 Team - Splits",
    description: "Statistics and results of an F1 team",
  };
}

async function getConstructorDetails(constructorId: string, year: number) {
  try {
    const [constructorInfoRes, resultsRes, standingsRes] = await Promise.all([
      fetch(
        `https://api.jolpi.ca/ergast/f1/constructors/${constructorId}.json`,
        {
          next: { revalidate: 43200 },
        }
      ),
      fetch(
        `https://api.jolpi.ca/ergast/f1/${year}/constructors/${constructorId}/results.json`,
        {
          next: { revalidate: 43200 },
        }
      ),
      fetch(`https://api.jolpi.ca/ergast/f1/${year}/constructorstandings/`, {
        next: { revalidate: 43200 },
      }),
    ]);

    if (!constructorInfoRes.ok || !resultsRes.ok) {
      throw new Error("Impossible de récupérer les données du constructeur");
    }

    const constructorInfoData = await constructorInfoRes.json();
    const resultsData = await resultsRes.json();
    const standingsData = await standingsRes.json();

    const constructorInfo: ConstructorInfo | null =
      constructorInfoData.MRData?.ConstructorTable?.Constructors?.[0] || null;
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

    const standings: ConstructorStanding[] =
      standingsData.MRData?.StandingsTable?.StandingsLists?.[0]
        ?.ConstructorStandings || [];
    const constructorStanding = standings.find(
      (s) => s.Constructor.constructorId === constructorId
    );

    if (!constructorInfo) {
      throw new Error("Constructor not found");
    }

    // Extraire les pilotes uniques
    const driversMap = new Map();
    results.forEach((result) => {
      if (!driversMap.has(result.Driver.driverId)) {
        driversMap.set(result.Driver.driverId, result.Driver);
      }
    });
    const drivers = Array.from(driversMap.values());

    return {
      constructorInfo,
      results,
      standing: constructorStanding,
      drivers,
    };
  } catch (error) {
    console.error("Error fetching constructor data:", error);
    throw error;
  }
}

export default async function ConstructorDetailPage({ params }: PageProps) {
  const { constructorId } = await params;
  const currentYear = new Date().getFullYear();
  const { constructorInfo, results, standing, drivers } =
    await getConstructorDetails(constructorId, currentYear);

  const teamColor = getConstructorColor(constructorId);
  const podiums = calculatePodiums(results);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Link
        href="/standings#constructor-standings"
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
          background: `linear-gradient(135deg, ${teamColor.primary}20, ${teamColor.secondary}20)`,
          borderLeft: `6px solid ${teamColor.primary}`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Team Logo */}
          <div
            className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-xl shadow-lg p-6 relative"
            style={{
              background: `linear-gradient(135deg, ${teamColor.primary}30, ${teamColor.secondary}30)`,
            }}
          >
            <Image
              src={getConstructorLogo(constructorId)}
              alt={constructorInfo.name}
              fill
              className="object-contain p-4"
            />
          </div>

          {/* Main info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {constructorInfo.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600">
              {getNationalityFlag(constructorInfo.nationality) && (
                <div className="flex items-center gap-2">
                  <Image
                    src={getNationalityFlag(constructorInfo.nationality)!}
                    alt={constructorInfo.nationality}
                    width={32}
                    height={32}
                    className="rounded shadow-sm"
                    unoptimized
                  />
                  <span className="text-lg">{constructorInfo.nationality}</span>
                </div>
              )}
            </div>
            {/* Team colors */}
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <span className="text-sm text-gray-600">Colors:</span>
              <div
                className="w-8 h-8 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: teamColor.primary }}
              />
              <div
                className="w-8 h-8 rounded-full shadow-md border-2 border-white"
                style={{ backgroundColor: teamColor.secondary }}
              />
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

      {/* Current Drivers */}
      {drivers.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{currentYear} Drivers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drivers.map(
              (driver: {
                driverId: string;
                code: string;
                givenName: string;
                familyName: string;
              }) => (
                <Link
                  key={driver.driverId}
                  href={`/drivers/${driver.driverId}`}
                  className="flex items-center gap-4 p-4 rounded-lg border-2 hover:shadow-md transition-shadow duration-300"
                  style={{ borderColor: teamColor.primary }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                    style={{ backgroundColor: teamColor.primary }}
                  >
                    {driver.code}
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-lg">
                      {driver.givenName}{" "}
                      <span className="uppercase">{driver.familyName}</span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Nationality:</span>
            <span className="ml-2 font-semibold">
              {constructorInfo.nationality}
            </span>
          </div>
          <div>
            <a
              href={constructorInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Learn more on Wikipedia
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
                    <th className="py-3 px-4">Driver</th>
                    <th className="py-3 px-4">Grid</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={`${result.round}-${result.Driver.driverId}-${index}`}
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
                      <td className="py-3 px-4">
                        <Link
                          href={`/drivers/${result.Driver.driverId}`}
                          className="hover:underline font-semibold"
                        >
                          {result.Driver.code}
                        </Link>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile version - Cards */}
            <div className="md:hidden space-y-4">
              {results.map((result, index) => (
                <div
                  key={`${result.round}-${result.Driver.driverId}-${index}`}
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
                      <span className="text-gray-600">Driver:</span>
                      <Link
                        href={`/drivers/${result.Driver.driverId}`}
                        className="ml-1 font-semibold hover:underline"
                      >
                        {result.Driver.code}
                      </Link>
                    </div>
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
