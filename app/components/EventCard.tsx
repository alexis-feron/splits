import Race from "@/app/types/Race";

export default function EventCard({ event }: { event: Race }) {
  const getFormula1Link = (raceName: string) => {
    const raceSlugMap: { [key: string]: string } = {
      "Australian Grand Prix": "australia",
      "Saudi Arabian Grand Prix": "saudi-arabia",
      "Bahrain Grand Prix": "bahrain",
      "Emilia Romagna Grand Prix": "emilia-romagna",
      "Monaco Grand Prix": "monaco",
      "Spanish Grand Prix": "spain",
      "Canadian Grand Prix": "canada",
      "Austrian Grand Prix": "austria",
      "British Grand Prix": "great-britain",
      "Hungarian Grand Prix": "hungary",
      "Belgian Grand Prix": "belgium",
      "Dutch Grand Prix": "netherlands",
      "Italian Grand Prix": "italy",
      "Singapore Grand Prix": "singapore",
      "Japanese Grand Prix": "japan",
      "Qatar Grand Prix": "qatar",
      "United States Grand Prix": "usa",
      "Mexican Grand Prix": "mexico",
      "Brazilian Grand Prix": "brazil",
      "Las Vegas Grand Prix": "las-vegas",
      "Abu Dhabi Grand Prix": "united-arab-emirates",
      "South African Grand Prix": "south-africa",
      "Vietnamese Grand Prix": "vietnam",
      "Indian Grand Prix": "india",
    };

    // Slugify fallback for new or unknown races
    const fallbackSlug = raceName
      .toLowerCase()
      .replace(/grand prix/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-$/, "");

    return `https://www.formula1.com/en/racing/2024/${
      raceSlugMap[raceName] || fallbackSlug
    }`;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2">{event.raceName}</h3>
      <p className="text-gray-700">
        {event.Circuit.circuitName}, {event.Circuit.Location.locality},{" "}
        {event.Circuit.Location.country}
      </p>
      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
      <a
        href={getFormula1Link(event.raceName)}
        target="_blank"
        title={`Learn more about the ${event.raceName} on the Formula 1 Official Website`}
        rel="noopener noreferrer"
        className="mt-2 inline-block text-red-600 hover:underline text-sm"
      >
        Learn more about the {event.raceName}
      </a>
    </div>
  );
}
