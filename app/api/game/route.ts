import Drivers from "@/app/services/drivers";
import { Driver } from "@/app/types/Driver";
import { Hints } from "@/app/types/Hints";
import crypto from "crypto";
import { NextResponse } from "next/server";

let drivers: Driver[] = [];

async function loadDrivers() {
  drivers = (await Drivers()) || [];
}

await loadDrivers();

// Détermine le pilote du jour
const getDriverOfTheDay = (): Driver => {
  if (drivers.length === 0) {
    throw new Error("La liste des pilotes est vide.");
  }
  const today = new Date().toISOString().slice(0, 10);
  const hash = crypto.createHash("sha256").update(today).digest("hex");
  const numericHash = parseInt(hash.slice(0, 8), 16);
  const index = numericHash % drivers.length;
  return drivers[index];
};

// Génère des indices basés sur la tentative
const generateHints = (guess: Driver, target: Driver): Hints => {
  return [
    guess.name === target.name ? "correct" : "incorrect",
    guess.flag === target.flag ? "correct" : "incorrect",
    guess.teams[guess.teams.length - 1] ===
    target.teams[target.teams.length - 1]
      ? "correct"
      : target.teams.includes(guess.teams[guess.teams.length - 1])
      ? "partially correct"
      : "incorrect",
    guess.carNumber === target.carNumber
      ? "correct"
      : guess.carNumber > target.carNumber
      ? "down"
      : "up",
    guess.age === target.age
      ? "correct"
      : guess.age > target.age
      ? "down"
      : "up",
    guess.firstYear === target.firstYear
      ? "correct"
      : guess.firstYear > target.firstYear
      ? "down"
      : "up",
    guess.wins === target.wins
      ? "correct"
      : guess.wins > target.wins
      ? "down"
      : "up",
  ];
};

// Handler de l'API
export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  // Trouve le pilote correspondant à la tentative
  const guess = drivers.find(
    (driver) => driver.name.toLowerCase() === name.toLowerCase()
  );
  if (!guess) {
    return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  }

  const target = getDriverOfTheDay();

  // Génère les indices pour la tentative
  const hints = generateHints(guess, target);

  // Vérifie si l'utilisateur a deviné correctement
  const isCorrect = guess.name === target.name;

  return NextResponse.json({ isCorrect, hints, guess });
}

export async function GET() {
  return NextResponse.json(getDriverOfTheDay().name);
}
