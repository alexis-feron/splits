import { RaceDetails, SessionTime } from "@/app/types/EventDetails";
import { formatSessionTime } from "@/app/utils/circuitUtils";

interface SessionTimelineProps {
  raceDetails: RaceDetails;
}

interface Session {
  name: string;
  type: "practice" | "qualifying" | "sprint" | "race";
  data: SessionTime;
}

export default function SessionTimeline({
  raceDetails,
}: SessionTimelineProps) {
  const sessions: Session[] = [];

  if (raceDetails.FirstPractice) {
    sessions.push({
      name: "Free Practice 1",
      type: "practice",
      data: raceDetails.FirstPractice,
    });
  }

  if (raceDetails.SecondPractice) {
    sessions.push({
      name: "Free Practice 2",
      type: "practice",
      data: raceDetails.SecondPractice,
    });
  }

  if (raceDetails.ThirdPractice) {
    sessions.push({
      name: "Free Practice 3",
      type: "practice",
      data: raceDetails.ThirdPractice,
    });
  }

  if (raceDetails.SprintQualifying) {
    sessions.push({
      name: "Sprint Qualifying",
      type: "qualifying",
      data: raceDetails.SprintQualifying,
    });
  }

  if (raceDetails.Sprint) {
    sessions.push({
      name: "Sprint",
      type: "sprint",
      data: raceDetails.Sprint,
    });
  }

  if (raceDetails.Qualifying) {
    sessions.push({
      name: "Qualifying",
      type: "qualifying",
      data: raceDetails.Qualifying,
    });
  }

  sessions.push({
    name: "Race",
    type: "race",
    data: { date: raceDetails.date, time: raceDetails.time },
  });

  const getSessionColor = (type: Session["type"]) => {
    switch (type) {
      case "practice":
        return "bg-gray-100 border-gray-300 text-gray-700";
      case "qualifying":
        return "bg-blue-100 border-blue-300 text-blue-700";
      case "sprint":
        return "bg-orange-100 border-orange-300 text-orange-700";
      case "race":
        return "bg-red-100 border-red-400 text-red-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const getSessionIcon = (type: Session["type"]) => {
    switch (type) {
      case "race":
        return "🏁";
      case "sprint":
        return "⚡";
      case "qualifying":
        return "⏱️";
      case "practice":
        return "🔧";
      default:
        return "📋";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Session Schedule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getSessionColor(
              session.type
            )}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSessionIcon(session.type)}</span>
                <h3 className="font-bold text-lg">{session.name}</h3>
              </div>
            </div>
            <p className="text-sm font-semibold">
              {formatSessionTime(session.data.date, session.data.time)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
