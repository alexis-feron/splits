import Link from "next/link";
import {
  EventDetailsData,
  RaceDetails,
  RaceResult,
  QualifyingResult,
  SprintResult,
} from "@/app/types/EventDetails";
import CircuitHero from "@/app/components/event-detail/CircuitHero";
import SessionTimeline from "@/app/components/event-detail/SessionTimeline";
import ResultsSection from "@/app/components/event-detail/ResultsSection";
import CircuitInfo from "@/app/components/event-detail/CircuitInfo";

interface PageProps {
  params: Promise<{ round: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { round } = await params;
    const currentYear = new Date().getFullYear();
    const response = await fetch(
      `https://api.jolpi.ca/ergast/f1/${currentYear}/races.json`,
      { next: { revalidate: 604800 } }
    );
    const data = await response.json();
    const race = data.MRData.RaceTable.Races.find(
      (r: RaceDetails) => r.round === round
    );

    if (race) {
      return {
        title: `${race.raceName} - Round ${round} - Splits F1`,
        description: `Complete information and results for the ${race.raceName} at ${race.Circuit.circuitName} in ${race.Circuit.Location.country}.`,
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "F1 Race Details - Splits",
    description: "Formula 1 race information and results",
  };
}

async function getEventDetails(
  round: string,
  year: number
): Promise<EventDetailsData> {
  // Step 1: Fetch race schedule (always needed)
  const scheduleResponse = await fetch(
    `https://api.jolpi.ca/ergast/f1/${year}/races.json`,
    { next: { revalidate: 604800 } }
  );

  if (!scheduleResponse.ok) {
    throw new Error("Failed to fetch race schedule");
  }

  const scheduleData = await scheduleResponse.json();
  const races = scheduleData.MRData.RaceTable.Races;
  const raceDetails: RaceDetails | undefined = races.find(
    (r: RaceDetails) => r.round === round
  );

  if (!raceDetails) {
    throw new Error("Race not found");
  }

  // Step 2: Determine if race has occurred
  const raceDateTime = new Date(`${raceDetails.date}T${raceDetails.time}`);
  const now = new Date();
  // Add 3 hours buffer to ensure race is complete
  raceDateTime.setHours(raceDateTime.getHours() + 3);
  const hasOccurred = now > raceDateTime;

  // Step 3: Conditional fetching for past races
  if (!hasOccurred) {
    return {
      raceDetails,
      hasOccurred: false,
    };
  }

  // Step 4: Parallel fetch results, qualifying, sprint (with error handling)
  const [resultsRes, qualifyingRes, sprintRes] = await Promise.allSettled([
    fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`,
      { next: { revalidate: 604800 } }
    ),
    fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying.json`,
      { next: { revalidate: 604800 } }
    ),
    fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint.json`,
      { next: { revalidate: 604800 } }
    ),
  ]);

  // Step 5: Extract data with fallbacks
  let results: RaceResult[] | undefined;
  let qualifying: QualifyingResult[] | undefined;
  let sprint: SprintResult[] | undefined;

  if (resultsRes.status === "fulfilled" && resultsRes.value.ok) {
    const data = await resultsRes.value.json();
    results = data.MRData.RaceTable.Races[0]?.Results || [];
  }

  if (qualifyingRes.status === "fulfilled" && qualifyingRes.value.ok) {
    const data = await qualifyingRes.value.json();
    qualifying = data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
  }

  if (sprintRes.status === "fulfilled" && sprintRes.value.ok) {
    const data = await sprintRes.value.json();
    const sprintRaces = data.MRData.RaceTable.Races;
    if (sprintRaces.length > 0) {
      sprint = sprintRaces[0].SprintResults || [];
    }
  }

  return {
    raceDetails,
    hasOccurred: true,
    results,
    qualifying,
    sprint,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { round } = await params;
  const currentYear = new Date().getFullYear();
  const eventData = await getEventDetails(round, currentYear);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Link
        href="/events"
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
        Back to Events
      </Link>

      {/* Hero Section - Circuit & Race Info */}
      <CircuitHero raceDetails={eventData.raceDetails} />

      {/* Session Schedule - Always show */}
      <SessionTimeline raceDetails={eventData.raceDetails} />

      {/* Results Section - Show dropdown toggles if race has occurred */}
      {eventData.hasOccurred && (
        <ResultsSection
          raceName={eventData.raceDetails.raceName}
          results={eventData.results}
          qualifying={eventData.qualifying}
          sprint={eventData.sprint}
        />
      )}

      {/* Circuit Info - Always show */}
      <CircuitInfo circuit={eventData.raceDetails.Circuit} />
    </div>
  );
}
