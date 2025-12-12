"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Race from "../types/Race";
import ThankYouBubble from "./components/ThankYouBubble";

export default function Landing() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const currentYear = new Date().getFullYear();
        const url = "https://api.jolpi.ca/ergast/f1/" + currentYear + "/races/";
        const response = await fetch(url);
        const data = await response.json();

        // Filtrer les événements à venir et passés
        const currentDate = new Date();
        const upcoming = data.MRData.RaceTable.Races.filter(
          (race: Race) => new Date(race.date) >= currentDate
        );
        const past = data.MRData.RaceTable.Races.filter(
          (race: Race) => new Date(race.date) < currentDate
        ).reverse(); // Les plus récents en premier

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section
          className="w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-black"
          style={{
            backgroundImage: "url('/banner.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container px-4 md:px-6 h-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 bg-black bg-opacity-50 p-4 rounded-md">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white RaceSport">
                  LITS
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Your one-stop destination for F1 standings, game, and upcoming
                  events.
                </p>
              </div>
            </div>
            <div className="mt-32">
              {" "}
              <Button
                onClick={() => {
                  document
                    .getElementById("standings")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-black bg-opacity-50 text-white hover:bg-white hover:text-black p-2 rounded-full pt-3"
                aria-label="Scroll to standings section"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 animate-bounce"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </section>
        <section
          id="standings"
          className="w-full py-12 flex items-center justify-center md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  F1 Standings
                </h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay up-to-date with the latest Formula 1 championship
                  standings.
                </p>
              </div>
            </div>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 mt-8">
              <Card>
                <Link
                  href="/standings#driver-standings"
                  title="Driver Standings"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Driver Standings
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">View Top Drivers</div>
                    <p className="text-xs text-gray-700">
                      See who&apos;s leading the championship
                    </p>
                  </CardContent>
                </Link>
              </Card>
              <Card>
                <Link
                  href="/standings#constructor-standings"
                  title="Constructor Standings"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Constructor Standings
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Team Rankings</div>
                    <p className="text-xs text-muted-foreground">
                      Check out the top performing teams
                    </p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="game"
          className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  F1 Game
                </h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"></p>
              </div>
            </div>
            <div className="mx-auto grid justify-center gap-4 grid-cols-1 mt-8 max-w-screen-md">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Gridle</CardTitle>
                  <CardDescription>Find the driver of the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      src="/game.webp"
                      alt="F1 Racing Game Screenshot"
                      className="object-cover w-full h-full"
                      layout="fill"
                    />
                    <Link href="/game" title="Gridle">
                      <Button className="absolute bottom-4 right-4 bg-red-600 text-white hover:bg-red-700">
                        Play Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="events"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex items-center justify-center"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {upcomingEvents.length > 0 ? "Upcoming F1 Events" : "Latest F1 Races"}
                </h2>
                <p className="max-w-[900px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {upcomingEvents.length > 0
                    ? "Stay informed about the latest Formula 1 races and events."
                    : "Check out the most recent Formula 1 races."}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center mt-8">Loading events...</div>
            ) : (
              <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents
                    .slice(0, 3)
                    .map((event: Race) => (
                      <EventCard key={event.raceName} event={event} />
                    ))
                ) : pastEvents.length > 0 ? (
                  pastEvents
                    .slice(0, 3)
                    .map((event: Race) => (
                      <EventCard key={event.raceName} event={event} />
                    ))
                ) : (
                  <p className="text-gray-500">No events available.</p>
                )}
              </div>
            )}
            <div className="flex justify-center mt-8">
              <Link href="/events" title="View All Events">
                <Button className="bg-red-600 text-white hover:bg-red-700">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <ThankYouBubble />
      </main>
    </div>
  );
}
