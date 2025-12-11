import { RaceDetails } from "@/app/types/EventDetails";
import { formatDate } from "@/app/standings/utils/standingsUtils";
import { getCircuitImage } from "@/app/utils/circuitUtils";
import Image from "next/image";

interface CircuitHeroProps {
  raceDetails: RaceDetails;
}

export default function CircuitHero({ raceDetails }: CircuitHeroProps) {
  const circuitImageUrl = getCircuitImage(raceDetails.Circuit.circuitId);

  return (
    <div className="rounded-2xl shadow-lg p-6 md:p-8 mb-8 bg-gradient-to-br from-red-50 to-gray-50 border-l-6 border-red-600">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Circuit Map */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center">
            <Image
              src={circuitImageUrl}
              alt={raceDetails.Circuit.circuitName}
              width={400}
              height={300}
              className="object-contain w-full h-auto"
              unoptimized
            />
          </div>
        </div>

        {/* Race Info */}
        <div className="flex-grow">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-gray-900">
            {raceDetails.raceName}
          </h1>
          <div className="space-y-2 text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-lg font-semibold">
                {raceDetails.Circuit.circuitName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
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
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span>
                {raceDetails.Circuit.Location.locality},{" "}
                {raceDetails.Circuit.Location.country}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg">{formatDate(raceDetails.date)}</span>
            </div>
            <div className="mt-4">
              <a
                href={raceDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                <span>Learn more on Wikipedia</span>
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
      </div>
    </div>
  );
}
