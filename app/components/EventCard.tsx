import Race from "@/app/types/Race";
import { getCircuitImage } from "@/app/utils/circuitUtils";
import Image from "next/image";
import Link from "next/link";

export default function EventCard({ event }: { event: Race }) {
  const getWeekendDates = () => {
    const sessions = [
      event.FirstPractice,
      event.SecondPractice,
      event.ThirdPractice,
      event.SprintQualifying,
      event.Sprint,
      event.Qualifying,
      { date: event.date, time: event.time },
    ].filter((session) => session);

    const dates = sessions.map((session) => new Date(session!.date));
    const startDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const endDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = endDate.toLocaleDateString("en-US", { month: "short" });

    return `${startDay} - ${endDay} ${month}`;
  };

  const getCountryFlag = (country: string): string | null => {
    const countryToCode: { [key: string]: string } = {
      Bahrain: "bh",
      "Saudi Arabia": "sa",
      Australia: "au",
      Japan: "jp",
      China: "cn",
      USA: "us",
      Italy: "it",
      Monaco: "mc",
      Canada: "ca",
      Spain: "es",
      Austria: "at",
      UK: "gb",
      Hungary: "hu",
      Belgium: "be",
      Netherlands: "nl",
      Singapore: "sg",
      Mexico: "mx",
      Brazil: "br",
      Qatar: "qa",
      UAE: "ae",
      Azerbaijan: "az",
    };
    const countryCode = countryToCode[country];
    if (!countryCode) return null;
    return `https://flagcdn.com/w320/${countryCode}.png`;
  };

  const circuitImage = getCircuitImage(event.Circuit.circuitId || "");
  const countryFlag = getCountryFlag(event.Circuit.Location.country);

  return (
    <Link href={`/events/${event.round}`}>
      <div className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-64">
        {/* Circuit background */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity duration-300">
          <Image
            src={circuitImage}
            alt={event.Circuit.circuitName}
            fill
            className="object-contain p-8"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="text-red-600 font-bold text-sm mb-2">
              ROUND {event.round}
            </div>
            <div className="flex items-center gap-3 mb-3">
              {countryFlag && (
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <Image
                    src={countryFlag}
                    alt={`${event.Circuit.Location.country} flag`}
                    width={48}
                    height={48}
                    className="object-contain rounded shadow-md"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {event.Circuit.Location.country}
                </h3>
                <p className="text-gray-600 text-sm">
                  {event.Circuit.circuitName}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="text-md font-semibold text-gray-700">
              {getWeekendDates()}
            </div>
            <div className="px-4 py-2 bg-red-600 text-white rounded-lg group-hover:bg-red-700 transition-colors font-semibold text-sm">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
