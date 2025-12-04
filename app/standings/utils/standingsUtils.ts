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
  return `https://flagcdn.com/w40/${countryCode}.png`;
}
