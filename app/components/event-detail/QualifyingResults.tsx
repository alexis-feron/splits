import {
  getConstructorColor,
  getConstructorLogo,
} from "@/app/standings/utils/standingsUtils";
import { QualifyingResult } from "@/app/types/EventDetails";
import Image from "next/image";
import Link from "next/link";

interface QualifyingResultsProps {
  qualifying: QualifyingResult[];
}

export default function QualifyingResults({
  qualifying,
}: QualifyingResultsProps) {
  // Group results by Q3, Q2, Q1
  const q3Results = qualifying.filter((q) => q.Q3);
  const q2Results = qualifying.filter((q) => q.Q2 && !q.Q3);
  const q1Results = qualifying.filter((q) => q.Q1 && !q.Q2);

  const renderQualifyingGroup = (
    results: QualifyingResult[],
    title: string,
    color: string
  ) => {
    if (results.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className={`text-lg font-bold mb-3 ${color}`}>{title}</h3>
        <div className="space-y-2">
          {results.map((result, index) => {
            const teamColor = getConstructorColor(
              result.Constructor.constructorId
            );
            const isPole = result.position === "1";

            return (
              <div
                key={`${result.position}-${index}`}
                className={`flex flex-col sm:flex-row sm:items-center p-3 rounded-lg border transition-all ${
                  isPole
                    ? "bg-yellow-50 border-yellow-400 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {/* Driver info section */}
                <div className="flex items-center gap-2 sm:gap-3 flex-grow min-w-0 mb-2 sm:mb-0">
                  <span
                    className={`font-bold text-base sm:text-lg w-6 sm:w-8 text-center flex-shrink-0 ${
                      isPole ? "text-yellow-600" : "text-gray-700"
                    }`}
                  >
                    {result.position}
                  </span>
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 relative rounded p-1 flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${teamColor.primary}40, ${teamColor.secondary}40)`,
                    }}
                  >
                    <Image
                      src={getConstructorLogo(result.Constructor.constructorId)}
                      alt={result.Constructor.name}
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <Link
                      href={`/drivers/${result.Driver.driverId}`}
                      className="font-semibold hover:text-blue-600 transition-colors text-sm sm:text-base block truncate"
                    >
                      {result.Driver.givenName} {result.Driver.familyName}
                    </Link>
                    <div className="text-xs text-gray-600 truncate">
                      {result.Constructor.name}
                    </div>
                  </div>
                </div>

                {/* Times section */}
                <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm font-mono justify-end sm:justify-start pl-8 sm:pl-0">
                  <div className="text-center min-w-[60px] sm:min-w-[70px]">
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Q1</div>
                    <div className="font-semibold">{result.Q1 || "-"}</div>
                  </div>
                  <div className="text-center min-w-[60px] sm:min-w-[70px]">
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Q2</div>
                    <div className="font-semibold">{result.Q2 || "-"}</div>
                  </div>
                  <div className="text-center min-w-[60px] sm:min-w-[70px]">
                    <div className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Q3</div>
                    <div
                      className={`font-semibold ${
                        isPole ? "text-yellow-600" : ""
                      }`}
                    >
                      {result.Q3 || "-"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      {renderQualifyingGroup(q3Results, "Q3 - Top 10", "text-green-600")}
      {renderQualifyingGroup(
        q2Results,
        "Q2 - Positions 11-15",
        "text-blue-600"
      )}
      {renderQualifyingGroup(
        q1Results,
        "Q1 - Positions 16-20",
        "text-gray-600"
      )}
    </div>
  );
}
