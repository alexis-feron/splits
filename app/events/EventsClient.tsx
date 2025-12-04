"use client";

import type Events from "@/app/types/Events";
import Race from "@/app/types/Race";
import { useState } from "react";
import EventCard from "../components/EventCard";

interface EventsClientProps {
  events: Events;
}

export default function EventsClient({ events }: EventsClientProps) {
  const [showPastEvents, setShowPastEvents] = useState(false);

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
          {displayedEvents.map((event: Race) => (
            <EventCard key={event.raceName} event={event} />
          ))}
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
          {(!events.upcoming.length && !showPastEvents) ||
          (!events.past.length && showPastEvents) ? (
            <p className="text-gray-500">No events.</p>
          ) : (
            <></>
          )}
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
