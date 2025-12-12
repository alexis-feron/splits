import { RaceDetails } from "@/app/types/EventDetails";
import CircuitMap from "./CircuitMap";

interface CircuitInfoProps {
  circuit: RaceDetails["Circuit"];
}

export default function CircuitInfo({ circuit }: CircuitInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center ">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Circuit Information
        </h2>

        <div className=" gap-6">
          {/* Circuit Details */}
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 block text-sm">Circuit Name</span>
              <span className="font-semibold text-lg">
                {circuit.circuitName}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block text-sm">Location</span>
              <span className="font-semibold text-lg">
                {circuit.Location.locality}, {circuit.Location.country}
              </span>
            </div>
            <div>
              <a
                href={circuit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800 underline inline-flex items-center gap-1 font-medium"
              >
                <span>View on Wikipedia</span>
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
      {/* Map */}

      <CircuitMap
        lat={circuit.Location.lat}
        long={circuit.Location.long}
        circuitName={circuit.circuitName}
      />
    </div>
  );
}
