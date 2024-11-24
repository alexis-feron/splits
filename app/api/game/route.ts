import { NextResponse } from "next/server";

type Driver = {
  name: string;
  flag: string; // URL du drapeau
  team: string;
  carNumber: number;
  age: number;
  firstYear: number;
  wins: number;
};

type Hint = "correct" | "incorrect" | "up" | "down";

type Hints = [Hint, Hint, Hint, Hint, Hint, Hint, Hint];

const drivers: Driver[] = [
  {
    name: "Lewis Hamilton",
    flag: "https://flagcdn.com/w320/gb.png",
    team: "Mercedes",
    carNumber: 44,
    age: 38,
    firstYear: 2007,
    wins: 103,
  },
  {
    name: "Max Verstappen",
    flag: "https://flagcdn.com/w320/nl.png",
    team: "RedBull",
    carNumber: 1,
    age: 26,
    firstYear: 2015,
    wins: 52,
  },
  {
    name: "Charles Leclerc",
    flag: "https://flagcdn.com/w320/mc.png",
    team: "Ferrari",
    carNumber: 16,
    age: 24,
    firstYear: 2018,
    wins: 2,
  },

  {
    name: "Sebastian Vettel",
    flag: "https://flagcdn.com/w320/de.png",
    team: "Aston Martin",
    carNumber: 5,
    age: 35,
    firstYear: 2007,
    wins: 53,
  },
  {
    name: "Fernando Alonso",
    flag: "https://flagcdn.com/w320/es.png",
    team: "Aston Martin",
    carNumber: 14,
    age: 41,
    firstYear: 2001,
    wins: 32,
  },
  {
    name: "Lando Norris",
    flag: "https://flagcdn.com/w320/gb.png",
    team: "McLaren",
    carNumber: 4,
    age: 23,
    firstYear: 2019,
    wins: 0,
  },
  {
    name: "Carlos Sainz",
    flag: "https://flagcdn.com/w320/es.png",
    team: "Ferrari",
    carNumber: 55,
    age: 28,
    firstYear: 2015,
    wins: 1,
  },
  {
    name: "Sergio Perez",
    flag: "https://flagcdn.com/w320/mx.png",
    team: "RedBull",
    carNumber: 11,
    age: 33,
    firstYear: 2011,
    wins: 4,
  },
  {
    name: "George Russell",
    flag: "https://flagcdn.com/w320/gb.png",
    team: "Mercedes",
    carNumber: 63,
    age: 25,
    firstYear: 2019,
    wins: 1,
  },
  {
    name: "Valtteri Bottas",
    flag: "https://flagcdn.com/w320/fi.png",
    team: "Alfa Romeo",
    carNumber: 77,
    age: 33,
    firstYear: 2013,
    wins: 10,
  },
  {
    name: "Esteban Ocon",
    flag: "https://flagcdn.com/w320/fr.png",
    team: "Alpine",
    carNumber: 31,
    age: 26,
    firstYear: 2016,
    wins: 1,
  },
  {
    name: "Pierre Gasly",
    flag: "https://flagcdn.com/w320/fr.png",
    team: "Alpine",
    carNumber: 10,
    age: 27,
    firstYear: 2017,
    wins: 1,
  },
  {
    name: "Kevin Magnussen",
    flag: "https://flagcdn.com/w320/dk.png",
    team: "Haas",
    carNumber: 20,
    age: 30,
    firstYear: 2014,
    wins: 0,
  },
]; // en cours de développement

// Détermine le pilote du jour (par exemple, en fonction de la date)
const getDriverOfTheDay = (): Driver => {
  const index = new Date().getDate() % drivers.length;
  return drivers[index];
};

// Génère des indices basés sur la tentative
const generateHints = (guess: Driver, target: Driver): Hints => {
  return [
    guess.name === target.name ? "correct" : "incorrect",
    guess.flag === target.flag ? "correct" : "incorrect",
    guess.team === target.team ? "correct" : "incorrect",
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

export async function GETDrivers() {
  const driverNames = drivers.map((driver) => driver.name);
  return NextResponse.json(driverNames);
}
