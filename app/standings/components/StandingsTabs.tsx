"use client";

import { useState, ReactNode } from "react";

interface StandingsTabsProps {
  driversContent: ReactNode;
  constructorsContent: ReactNode;
}

export default function StandingsTabs({
  driversContent,
  constructorsContent,
}: StandingsTabsProps) {
  const [activeTab, setActiveTab] = useState<"drivers" | "constructors">(
    "drivers"
  );

  return (
    <>
      {/* Tabs pour mobile */}
      <div className="lg:hidden flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("drivers")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === "drivers"
              ? "bg-white shadow-md text-black"
              : "text-gray-600"
          }`}
        >
          Drivers
        </button>
        <button
          onClick={() => setActiveTab("constructors")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === "constructors"
              ? "bg-white shadow-md text-black"
              : "text-gray-600"
          }`}
        >
          Constructors
        </button>
      </div>

      {/* Affichage mobile avec tabs */}
      <div className="lg:hidden">
        {activeTab === "drivers" ? (
          <div id="driver-standings" className="scroll-mt-16">
            {driversContent}
          </div>
        ) : (
          <div id="constructor-standings" className="scroll-mt-16">
            {constructorsContent}
          </div>
        )}
      </div>
    </>
  );
}
