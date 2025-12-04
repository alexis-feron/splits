import type Events from "@/app/types/Events";
import Race from "@/app/types/Race";
import EventsClient from "./EventsClient";

async function getEvents(): Promise<Events> {
  const currentYear = new Date().getFullYear();
  const url = "https://api.jolpi.ca/ergast/f1/" + currentYear + "/races/";

  const response = await fetch(url, {
    next: { revalidate: 43200 }, // Cache pour 12 heures
  });

  const data = await response.json();

  const currentDate = new Date();
  const upcomingEvents = data.MRData.RaceTable.Races.filter(
    (race: Race) => new Date(race.date) >= currentDate
  );

  const pastEvents = data.MRData.RaceTable.Races.filter(
    (race: Race) => new Date(race.date) < currentDate
  );

  return { upcoming: upcomingEvents, past: pastEvents };
}

export default async function Events() {
  const events = await getEvents();

  if (!events.upcoming.length && !events.past.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-122px)]">
        <p>No events found.</p>
      </div>
    );
  }

  return <EventsClient events={events} />;
}
