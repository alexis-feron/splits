import {
  getConstructorColor,
  getConstructorLogo,
  getPositionColor,
} from "@/app/standings/utils/standingsUtils";
import { RaceResult } from "@/app/types/EventDetails";
import Image from "next/image";
import Link from "next/link";

interface RaceResultsProps {
  results: RaceResult[];
  raceName: string;
}

export default function RaceResults({ results }: RaceResultsProps) {
  return (
    <div className="mb-4">
      {/* Desktop version - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-gray-200">
            <tr className="text-left">
              <th className="py-3 px-4">Pos</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Team</th>
              <th className="py-3 px-4">Grid</th>
              <th className="py-3 px-4">Laps</th>
              <th className="py-3 px-4">Time/Status</th>
              <th className="py-3 px-4">Fastest Lap</th>
              <th className="py-3 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const teamColor = getConstructorColor(
                result.Constructor.constructorId
              );
              return (
                <tr
                  key={`${result.position}-${index}`}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPositionColor(
                        result.position
                      )}`}
                    >
                      {result.position}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/drivers/${result.Driver.driverId}`}
                      className="hover:text-blue-600 transition-colors font-semibold"
                    >
                      {result.Driver.givenName} {result.Driver.familyName}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/constructors/${result.Constructor.constructorId}`}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div
                        className="w-8 h-8 relative rounded p-1"
                        style={{
                          background: `linear-gradient(135deg, ${teamColor.primary}40, ${teamColor.secondary}40)`,
                        }}
                      >
                        <Image
                          src={getConstructorLogo(
                            result.Constructor.constructorId
                          )}
                          alt={result.Constructor.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span className="font-semibold">
                        {result.Constructor.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{result.grid}</td>
                  <td className="py-3 px-4 text-gray-600">{result.laps}</td>
                  <td className="py-3 px-4">
                    {result.Time ? (
                      <span className="font-semibold">{result.Time.time}</span>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        {result.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {result.FastestLap?.rank === "1" ? (
                      <span className="text-purple-600 font-semibold flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {result.FastestLap.Time.time}
                      </span>
                    ) : (
                      <span className="text-gray-600">
                        {result.FastestLap?.Time?.time || "-"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold">{result.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile version - Cards */}
      <div className="md:hidden space-y-4">
        {results.map((result, index) => {
          const teamColor = getConstructorColor(
            result.Constructor.constructorId
          );
          return (
            <div
              key={`${result.position}-${index}`}
              className="border border-gray-200 rounded-lg p-4"
              style={{
                borderLeft: `4px solid ${teamColor.primary}`,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Link
                    href={`/drivers/${result.Driver.driverId}`}
                    className="font-bold text-lg hover:text-blue-600 transition-colors"
                  >
                    {result.Driver.givenName} {result.Driver.familyName}
                  </Link>
                  <Link
                    href={`/constructors/${result.Constructor.constructorId}`}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors block"
                  >
                    {result.Constructor.name}
                  </Link>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getPositionColor(
                    result.position
                  )}`}
                >
                  P{result.position}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Grid:</span>
                  <span className="ml-1 font-semibold">{result.grid}</span>
                </div>
                <div>
                  <span className="text-gray-600">Laps:</span>
                  <span className="ml-1 font-semibold">{result.laps}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-1 font-semibold">
                    {result.Time?.time || result.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Points:</span>
                  <span className="ml-1 font-semibold">{result.points}</span>
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
          );
        })}
      </div>
    </div>
  );
}
