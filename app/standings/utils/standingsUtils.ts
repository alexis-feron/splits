// Mapping des nationalités vers les codes ISO des pays pour les drapeaux
export const nationalityToCountryCode: { [key: string]: string } = {
  British: "gb",
  Dutch: "nl",
  Monegasque: "mc",
  Spanish: "es",
  Mexican: "mx",
  Australian: "au",
  French: "fr",
  Canadian: "ca",
  German: "de",
  Japanese: "jp",
  Chinese: "cn",
  Danish: "dk",
  Thai: "th",
  Finnish: "fi",
  American: "us",
  "New Zealander": "nz",
  Argentine: "ar",
  "New Zealand": "nz",
  Italian: "it",
  Austrian: "at",
  Swiss: "ch",
  Brazilian: "br",
  Belgian: "be",
  Polish: "pl",
  Swedish: "se",
  Indian: "in",
  Russian: "ru",
  Venezuelan: "ve",
  Colombian: "co",
  Malaysian: "my",
  Indonesian: "id",
};

// Mapping des constructorId vers les noms de fichiers de logos
export const constructorIdToLogo: { [key: string]: string } = {
  mclaren: "McLaren",
  ferrari: "Ferrari",
  red_bull: "RedBull",
  mercedes: "Mercedes",
  aston_martin: "AstonMartin",
  alpine: "Alpine",
  haas: "Haas",
  rb: "RB",
  williams: "Williams",
  sauber: "Sauber",
  kick_sauber: "Sauber",
  alfa: "AlfaRomeo",
  alphatauri: "AlphaTauri",
  renault: "Renault",
  racing_point: "RacingPoint",
  toro_rosso: "ToroRosso",
  force_india: "ForceIndia",
  manor: "Marussia",
  caterham: "Caterham",
  lotus_f1: "Lotus",
  bmw_sauber: "BMWSauber",
  toyota: "Toyota",
  brawn: "Brawn",
  honda: "Honda",
};

// Couleurs des équipes pour un meilleur design
export const constructorColors: {
  [key: string]: { primary: string; secondary: string };
} = {
  mclaren: { primary: "#FF8700", secondary: "#47C7FC" },
  ferrari: { primary: "#E8002D", secondary: "#FFF200" },
  red_bull: { primary: "#3671C6", secondary: "#FF0000" },
  mercedes: { primary: "#27F4D2", secondary: "#000000" },
  aston_martin: { primary: "#229971", secondary: "#CEDC00" },
  alpine: { primary: "#FF87BC", secondary: "#2293D1" },
  haas: { primary: "#B6BABD", secondary: "#ED1C24" },
  rb: { primary: "#6692FF", secondary: "#2B2B2B" },
  williams: { primary: "#64C4FF", secondary: "#041E42" },
  sauber: { primary: "#52E252", secondary: "#000000" },
  kick_sauber: { primary: "#52E252", secondary: "#000000" },
  alfa: { primary: "#C92D4B", secondary: "#FFFFFF" },
  alphatauri: { primary: "#5E8FAA", secondary: "#FFFFFF" },
  renault: { primary: "#FFD800", secondary: "#000000" },
  racing_point: { primary: "#F596C8", secondary: "#005AAE" },
  toro_rosso: { primary: "#469BFF", secondary: "#FF0000" },
  force_india: { primary: "#F596C8", secondary: "#000000" },
};

export function getConstructorLogo(constructorId: string): string {
  const logoName = constructorIdToLogo[constructorId] || "McLaren";
  return `/logos/${logoName}.png`;
}

export function getConstructorColor(constructorId: string): {
  primary: string;
  secondary: string;
} {
  return (
    constructorColors[constructorId] || {
      primary: "#000000",
      secondary: "#FFFFFF",
    }
  );
}

export function getNationalityFlag(nationality: string): string | null {
  const countryCode = nationalityToCountryCode[nationality];
  if (!countryCode) return null;
  // Utilise l'API flagcdn pour obtenir les vrais drapeaux en PNG
  return `https://flagcdn.com/w320/${countryCode}.png`;
}

// Types pour les données de l'API
interface Race {
  round: string;
  date: string;
  time?: string;
  Sprint?: unknown;
}

interface RaceData {
  MRData: {
    RaceTable: {
      Races: Race[];
    };
  };
}

interface SprintData {
  MRData: {
    RaceTable: {
      Races: Array<{
        round: string;
      }>;
    };
  };
}

/**
 * Calcule si le leader du classement est mathématiquement champion
 * @param leaderPoints Points du premier
 * @param secondPoints Points du second
 * @param currentYear Année de la saison
 * @returns true si le leader est champion mathématique
 */
export async function isChampionClinched(
  leaderPoints: number,
  secondPoints: number,
  currentYear: number
): Promise<boolean> {
  try {
    // Récupérer toutes les courses de la saison
    const racesResponse = await fetch(
      `https://api.jolpi.ca/ergast/f1/${currentYear}/races/`,
      { next: { revalidate: 3600 } } // Cache 1 heure
    );
    const racesData: RaceData = await racesResponse.json();
    const allRaces = racesData.MRData.RaceTable.Races;

    // Récupérer les courses avec sprint
    const sprintResponse = await fetch(
      `https://api.jolpi.ca/ergast/f1/${currentYear}/sprint/`,
      { next: { revalidate: 3600 } }
    );
    const sprintData: SprintData = await sprintResponse.json();
    const sprintRounds = new Set(
      sprintData.MRData.RaceTable.Races.map((race) => race.round)
    );

    // Déterminer la date/heure actuelle
    const now = new Date();

    // Filtrer les courses restantes (non encore complétées)
    const remainingRaces = allRaces.filter((race) => {
      const raceDateTime = new Date(`${race.date}T${race.time || "14:00:00Z"}`);
      // Ajouter 3 heures après l'heure de début pour considérer la course comme terminée
      raceDateTime.setHours(raceDateTime.getHours() + 3);
      return raceDateTime > now;
    });

    // Calculer les points maximum restants
    let maxPointsRemaining = 0;
    for (const race of remainingRaces) {
      if (sprintRounds.has(race.round)) {
        // Course avec sprint: 25 (course) + 8 (sprint) = 33 points
        maxPointsRemaining += 33;
      } else {
        // Course normale: 25 points
        maxPointsRemaining += 25;
      }
    }

    // Le leader est champion si même avec tous les points restants,
    // le second ne peut pas le rattraper
    const isChampion = leaderPoints - secondPoints > maxPointsRemaining;

    return isChampion;
  } catch (error) {
    console.error("Error calculating champion status:", error);
    return false;
  }
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param dateOfBirth Date de naissance au format string
 * @returns Âge en années
 */
export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

/**
 * Formate une date en string lisible
 * @param dateString Date au format string
 * @returns Date formatée en français
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Retourne les classes CSS pour la couleur selon la position
 * @param position Position finale (string ou number)
 * @returns Classes Tailwind CSS
 */
export function getPositionColor(position: string | number): string {
  const pos = typeof position === "string" ? parseInt(position) : position;
  if (isNaN(pos)) return "bg-gray-100 text-gray-800";
  if (pos === 1)
    return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
  if (pos === 2)
    return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
  if (pos === 3)
    return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
  if (pos <= 10) return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

/**
 * Calcule le nombre de podiums depuis une liste de résultats
 * @param results Tableau de résultats de courses
 * @returns Nombre de podiums (positions 1-3)
 */
export function calculatePodiums(
  results: Array<{ position: string | number }>
): number {
  return results.filter((r) => {
    const pos =
      typeof r.position === "string" ? parseInt(r.position) : r.position;
    return !isNaN(pos) && pos <= 3;
  }).length;
}
