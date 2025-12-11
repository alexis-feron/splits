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
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isPole
                    ? "bg-yellow-50 border-yellow-400 shadow-md"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 flex-grow">
                  <span
                    className={`font-bold text-lg w-8 text-center ${
                      isPole ? "text-yellow-600" : "text-gray-700"
                    }`}
                  >
                    {result.position}
                  </span>
                  <div
                    className="w-8 h-8 relative rounded p-1 flex-shrink-0"
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
                  <div className="flex-grow">
                    <Link
                      href={`/drivers/${result.Driver.driverId}`}
                      className="font-semibold hover:text-blue-600 transition-colors"
                    >
                      {result.Driver.givenName} {result.Driver.familyName}
                    </Link>
                    <div className="text-xs text-gray-600">
                      {result.Constructor.name}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-4 text-sm font-mono">
                  <div className="text-center w-16 md:w-20">
                    <div className="text-xs text-gray-500">Q1</div>
                    <div className="font-semibold">{result.Q1 || "-"}</div>
                  </div>
                  <div className="text-center w-16 md:w-20">
                    <div className="text-xs text-gray-500">Q2</div>
                    <div className="font-semibold">{result.Q2 || "-"}</div>
                  </div>
                  <div className="text-center w-16 md:w-20">
                    <div className="text-xs text-gray-500">Q3</div>
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
