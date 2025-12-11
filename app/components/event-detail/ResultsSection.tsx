"use client";

import { useState } from "react";
import {
  RaceResult,
  QualifyingResult,
  SprintResult,
} from "@/app/types/EventDetails";
import RaceResults from "./RaceResults";
import QualifyingResults from "./QualifyingResults";
import SprintResults from "./SprintResults";

interface ResultsSectionProps {
  raceName: string;
  results?: RaceResult[];
  qualifying?: QualifyingResult[];
  sprint?: SprintResult[];
}

export default function ResultsSection({
  raceName,
  results,
  qualifying,
  sprint,
}: ResultsSectionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: "race",
      title: "🏁 Race Results",
      data: results,
      component: results && <RaceResults results={results} raceName={raceName} />,
    },
    {
      id: "sprint",
      title: "⚡ Sprint Results",
      data: sprint,
      component: sprint && <SprintResults sprint={sprint} />,
    },
    {
      id: "qualifying",
      title: "⏱️ Qualifying Results",
      data: qualifying,
      component: qualifying && <QualifyingResults qualifying={qualifying} />,
    },
  ].filter((section) => section.data && section.data.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 space-y-4">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Results
      </h2>

      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-bold text-gray-800">
              {section.title}
            </span>
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
                openSection === section.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openSection === section.id && (
            <div className="border-t border-gray-200 p-6 animate-fadeIn">
              {section.component}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
