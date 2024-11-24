"use client";

import type Events from "@/app/types/Events";
import Race from "@/app/types/Race";
import { useEffect, useState } from "react";
import EventCard from "./components/EventCard";

export default function Events() {
  const [events, setEvents] = useState<Events>({ upcoming: [], past: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://ergast.com/api/f1/current.json");
        const data = await response.json();

        // Trier les événements en passés et à venir
        const currentDate = new Date();
        const upcomingEvents = data.MRData.RaceTable.Races.filter(
          (race: Race) => {
            return new Date(race.date) >= currentDate;
          }
        );

        const pastEvents = data.MRData.RaceTable.Races.filter((race: Race) => {
          return new Date(race.date) < currentDate;
        });

        setEvents({ upcoming: upcomingEvents, past: pastEvents });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-66px)]">
        <p>Loading events...</p>
      </div>
    );
  }

  if (!events.upcoming.length && !events.past.length) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-122px)]">
        <p>No events found.</p>
      </div>
    );
  }

  const displayedEvents = showPastEvents ? events.past : events.upcoming;

  return (
    <section className="w-full py-4 md:py-10 lg:py-16 bg-gray-100 min-h-[calc(100vh-122px)]">
      <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            {showPastEvents
              ? `Past F1 ${new Date().getFullYear()} Events`
              : `Upcoming F1 ${new Date().getFullYear()} Events`}
          </h2>
          <p className="text-gray-500 md:text-xl py-4">
            {showPastEvents
              ? "Look back at the previous Formula 1 races and events."
              : "Stay informed about the latest Formula 1 races and events."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => (
            <EventCard key={event.raceName} event={event} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowPastEvents((prev) => !prev)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {showPastEvents ? "View Upcoming Events" : "View Past Events"}
          </button>
        </div>
      </div>
    </section>
  );
}
