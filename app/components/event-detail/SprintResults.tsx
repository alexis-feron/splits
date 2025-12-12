import {
  getConstructorColor,
  getConstructorLogo,
  getPositionColor,
} from "@/app/standings/utils/standingsUtils";
import { SprintResult } from "@/app/types/EventDetails";
import Image from "next/image";
import Link from "next/link";

interface SprintResultsProps {
  sprint: SprintResult[];
}

export default function SprintResults({ sprint }: SprintResultsProps) {
  return (
    <div className="mb-4 md:border-l-4 border-orange-500">
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
              <th className="py-3 px-4">Points</th>
            </tr>
          </thead>
          <tbody>
            {sprint.map((result, index) => {
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
                  <td className="py-3 px-4">
                    <span className="font-bold text-orange-600">
                      {result.points}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile version - Cards */}
      <div className="md:hidden space-y-4">
        {sprint.map((result, index) => {
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
                  <span className="ml-1 font-semibold text-orange-600">
                    {result.points}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-orange-50 border-r border-orange-200 rounded-lg">
        <p className="text-sm text-orange-800">
          <strong>Sprint Race:</strong> Points are awarded to the top 8
          finishers (8-7-6-5-4-3-2-1)
        </p>
      </div>
    </div>
  );
}
