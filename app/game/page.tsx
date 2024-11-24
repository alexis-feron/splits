"use client";

import Stats from "@/app/types/Stats";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Driver } from "../types/Driver";
import { Hints } from "../types/Hints";
import GameBoard from "./components/GameBoard";
import InputBar from "./components/InputBar";
import Statistics from "./components/Statistics";
import Tutorial from "./components/Tutorial";

const STORAGE_KEY = "game_data";

export default function Home() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
  const [hints, setHints] = useState<Hints[]>([]);
  const [guesses, setGuesses] = useState<Driver[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [driverOfTheDay, setDriverOfTheDay] = useState<string | null>(null);

  // Fonction pour vérifier si la date est d'aujourd'hui
  const isDataFromToday = (timestamp: number): boolean => {
    const today = new Date();
    const storedDate = new Date(timestamp);

    return (
      today.getFullYear() === storedDate.getFullYear() &&
      today.getMonth() === storedDate.getMonth() &&
      today.getDate() === storedDate.getDate()
    );
  };

  // Sauvegarder dans LocalStorage à chaque changement
  useEffect(() => {
    const saveToStorage = () => {
      const data = { hints, guesses, isCorrect, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    if (guesses.length || hints.length) saveToStorage();
  }, [hints, guesses, isCorrect]);

  // Charger les données depuis LocalStorage au montage
  useEffect(() => {
    const loadFromStorage = () => {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const {
          hints: storedHints,
          guesses: storedGuesses,
          isCorrect: storedIsCorrect,
          timestamp,
        } = parsedData;

        // Vérifier si les données sont d'aujourd'hui
        if (isDataFromToday(timestamp)) {
          setHints(storedHints || []);
          setGuesses(storedGuesses || []);
          setIsCorrect(storedIsCorrect || false);
        } else {
          localStorage.removeItem(STORAGE_KEY); // Supprimer si les données ne sont pas d'aujourd'hui
        }
      }
    };

    loadFromStorage();
  }, []);

  // Récupérer le driver of the day uniquement si nécessaire
  useEffect(() => {
    if (!isCorrect && guesses.length === 6 && !driverOfTheDay) {
      const fetchDriverOfTheDay = async () => {
        try {
          const response = await fetch("/api/game");
          const data = await response.json();
          setDriverOfTheDay(data); // Mettre à jour l'état avec la réponse de l'API
        } catch (error) {
          console.error("Error fetching driver of the day:", error);
          setDriverOfTheDay("Unavailable"); // Valeur par défaut en cas d'erreur
        }
      };

      fetchDriverOfTheDay();
    }
  }, [isCorrect, guesses.length, driverOfTheDay]);

  const updateStatistics = (isWin: boolean) => {
    const storedStats = localStorage.getItem("game_stats");
    const stats: Stats = storedStats
      ? JSON.parse(storedStats)
      : {
          played: 0,
          won: 0,
          lost: 0,
          streak: 0,
          maxStreak: 0,
        };

    stats.played += 1; // Augmenter le nombre de parties jouées

    if (isWin) {
      stats.won += 1;
      stats.streak += 1;
      if (stats.streak > stats.maxStreak) {
        stats.maxStreak = stats.streak;
      }
    } else {
      stats.lost += 1;
      stats.streak = 0; // Réinitialiser la série si défaite
    }

    localStorage.setItem("game_stats", JSON.stringify(stats));
  };

  const handleDriverSubmit = async (driverName: string) => {
    if (isCorrect) return; // Bloquer toute saisie si réponse correcte

    const response = await fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: driverName }),
    });

    if (response.ok) {
      const result = await response.json();
      setHints((prev) => [...prev, result.hints]);
      setGuesses((prev) => [...prev, result.guess]);
      setIsCorrect(result.isCorrect); // Mettre à jour `isCorrect`

      if (result.isCorrect || guesses.length + 1 === 6) {
        // Jeu terminé (victoire ou défaite)
        updateStatistics(result.isCorrect);
      }
    } else {
      console.error("Error:", await response.json());
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isCorrect && (
        <Confetti
          width={window.innerWidth - 18}
          height={window.innerHeight}
          numberOfPieces={300}
          gravity={0.3}
          recycle={false}
        />
      )}
      <main className="p-4">
        <GameBoard hints={hints} guesses={guesses} />
        {!isCorrect && guesses.length < 6 ? (
          <InputBar onSubmit={handleDriverSubmit} />
        ) : (
          <div className="text-center">
            {isCorrect ? (
              <h2 className="text-xl font-semibold">
                Congratulations! You&apos;ve guessed the correct driver!
              </h2>
            ) : (
              <h2 className="text-xl font-semibold">
                You&apos;ve run out of guesses. Better luck next time. The
                correct driver was: {driverOfTheDay || "Loading..."}
              </h2>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-evenly">
          <button
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
            onClick={() => setIsTutorialOpen(true)}
          >
            How to play?
          </button>
          <button
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
            onClick={() => setIsStatisticsOpen(true)}
          >
            Statistics
          </button>
        </div>
      </main>

      {isTutorialOpen && <Tutorial onClose={() => setIsTutorialOpen(false)} />}
      {isStatisticsOpen && (
        <Statistics onClose={() => setIsStatisticsOpen(false)} />
      )}
    </div>
  );
}
