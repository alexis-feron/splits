import redis, { CACHE_KEY } from "@/app/utils/redis";

export const updateDriversCache = async () => {
  const drivers = await fetchDrivers(); // Récupère les pilotes
  await redis.set(CACHE_KEY, JSON.stringify(drivers)); // Met à jour Redis
};

const API_BASE_URL = "https://ergast.com/api/f1";

// Transforme la nationalité en URL d'un drapeau
const getFlagUrl = (nationality: string) => {
  const nationalityToCode: { [key: string]: string } = {
    Spanish: "es",
    British: "gb",
    German: "de",
    Finnish: "fi",
    Mexican: "mx",
    Dutch: "nl",
    French: "fr",
    Danish: "dk",
    Australian: "au",
    Canadian: "ca",
    Brazilian: "br",
    Russian: "ru",
    Italian: "it",
    Swedish: "se",
    Belgian: "be",
    Japanese: "jp",
    Austrian: "at",
    American: "us",
    Argentine: "ar",
    Colombian: "co",
    Venezuelan: "ve",
    "New Zealander": "nz",
    "South African": "za",
    Portuguese: "pt",
    Polish: "pl",
    Hungarian: "hu",
    Indian: "in",
    Irish: "ie",
    Malaysian: "my",
    Chilean: "cl",
    Indonesian: "id",
    Thai: "th",
    Uruguayan: "uy",
    Swiss: "ch",
    Cypriot: "cy",
    Monegasque: "mc",
    Liechtensteiner: "li",
    Estonian: "ee",
    Azerbaijani: "az",
    Armenian: "am",
    Georgian: "ge",
    Kazakh: "kz",
    Kyrgyz: "kg",
    Uzbek: "uz",
    Turkmen: "tm",
    Tajik: "tj",
    Afghan: "af",
    Pakistani: "pk",
    Bangladeshi: "bd",
    Nepalese: "np",
    Bhutanese: "bt",
    SriLankan: "lk",
    Maldivian: "mv",
    Emirati: "ae",
    Saudi: "sa",
    Qatari: "qa",
    Kuwaiti: "kw",
    Bahraini: "bh",
    Omani: "om",
    Yemeni: "ye",
    Jordanian: "jo",
    Lebanese: "lb",
    Syrian: "sy",
    Iraqi: "iq",
    Israeli: "il",
    Palestinian: "ps",
    Egyptian: "eg",
    Sudanese: "sd",
    Libyan: "ly",
    Tunisian: "tn",
    Algerian: "dz",
    Moroccan: "ma",
    Mauritanian: "mr",
    Malian: "ml",
    Zimbabwean: "zw",
    Angolan: "ao",
    Botswanan: "bw",
    Namibian: "na",
    Zambian: "zm",
    Mozambican: "mz",
    Ivorian: "ci",
    Ghanaian: "gh",
    Nigerian: "ng",
    Cameroonian: "cm",
    Senegalese: "sn",
    Ugandan: "ug",
    Rwandan: "rw",
    Burundian: "bi",
    Tanzanian: "tz",
    Kenyan: "ke",
    Somali: "so",
    Ethiopian: "et",
    Eritrean: "er",
    Djiboutian: "dj",
    Congolese: "cd",
    Gabonese: "ga",
    "Central African": "cf",
    "Equatorial Guinean": "gq",
    Chadian: "td",
    Nigerien: "ne",
    Burkinabe: "bf",
    Togolese: "tg",
    Beninese: "bj",
    "Sierra Leonean": "sl",
    Liberian: "lr",
    Guinean: "gn",
    "Bissau Guinean": "gw",
    Gambian: "gm",
    CapeVerdean: "cv",
    Malagasy: "mg",
    Seychellois: "sc",
    Comoran: "km",
    Mauritian: "mu",
    Lesotho: "ls",
    Swazi: "sz",
    Malawian: "mw",
    "South Sudanese": "ss",
    Sahrawi: "eh",
    "Cape Verdian": "cv",
    "Saint Helenian": "sh",
    "Ascension Islander": "ac",
    Tristanian: "ta",
    "São Toméan": "st",
    Príncipean: "st",
    Equatoguinean: "gq",
    "Saint Lucian": "lc",
    "Saint Vincentian": "vc",
    Grenadian: "gd",
    Barbadian: "bb",
    Trinidadian: "tt",
    Tobagonian: "tt",
    "Saint Kitts and Nevis": "kn",
    Antiguan: "ag",
    Dominican: "do",
    Haitian: "ht",
    Bahamian: "bs",
    Jamaican: "jm",
    Cuban: "cu",
    "Puerto Rican": "pr",
    "Dominican Republic": "do",
    "Costa Rican": "cr",
    Panamanian: "pa",
    Nicaraguan: "ni",
    Honduran: "hn",
    Salvadoran: "sv",
    Guatemalan: "gt",
    Belizean: "bz",
    Chinese: "cn",
    Korean: "kr",
    Vietnamese: "vn",
    Mongolian: "mn",
    Taiwanese: "tw",
    "Hong Kong": "hk",
    Macanese: "mo",
    Filipino: "ph",
    Singapore: "sg",
    Argentinian: "ar",
  };
  const countryCode = nationalityToCode[nationality];
  if (!countryCode) return null;
  return `https://flagcdn.com/w320/${countryCode}.png`;
};

// Récupération des pilotes
const fetchDrivers = async () => {
  const startYear = 2022;
  const currentYear = new Date().getFullYear();
  const driversMap: {
    [driverId: string]: Driver & {
      firstYear: number;
      team: string;
      wins?: number;
    };
  } = {};
  for (let year = startYear; year <= currentYear; year++) {
    const seasonDrivers = await fetchDriversFromAPI(year);
    seasonDrivers.forEach((driver) => {
      if (!driversMap[driver.driverId]) {
        // Ajouter un nouveau pilote avec ses informations initiales
        driversMap[driver.driverId] = {
          ...driver,
          firstYear: year, // Première apparition
          team: driver.team, // Équipe de la première année
        };
      } else {
        // Mettre à jour les informations existantes
        driversMap[driver.driverId].firstYear = Math.min(
          driversMap[driver.driverId].firstYear,
          year
        );
        driversMap[driver.driverId].team = driver.team; // Mettre à jour avec l'équipe la plus récente
      }
    });
  }
  return Object.values(driversMap);
};

interface Driver {
  driverId: string;
  givenName: string;
  familyName: string;
  nationality: string;
  dateOfBirth: string;
  permanentNumber?: string;
  name?: string;
  flag?: string;
  age?: number;
  firstYear?: number;
  team?: string;
  wins?: number;
}

// Récupère les pilotes d'une saison spécifique
const fetchDriversFromAPI = async (season: number) => {
  const response = await fetch(`${API_BASE_URL}/${season}/drivers.json`);
  const data = await response.json();
  const drivers = data.MRData.DriverTable.Drivers;
  return Promise.all(
    drivers.map(async (driver: Driver) => {
      const wins = await fetchDriverWins(driver.driverId);
      const team = await fetchDriverTeam(driver.driverId, season);
      return {
        name: `${driver.givenName} ${driver.familyName}`,
        nationality: driver.nationality,
        flag: getFlagUrl(driver.nationality) || "Unknown",
        dateOfBirth: driver.dateOfBirth,
        age:
          new Date().getFullYear() - new Date(driver.dateOfBirth).getFullYear(),
        driverId: driver.driverId,
        permanentNumber: driver.permanentNumber || "/",
        firstYear: season,
        team,
        wins,
      };
    })
  );
};

const fetchDriverTeam = async (driverId: string, season: number) => {
  const response = await fetch(
    `${API_BASE_URL}/${season}/drivers/${driverId}/constructors.json`
  );
  const data = await response.json();
  const constructors = data.MRData.ConstructorTable.Constructors;
  return constructors.length > 0 ? constructors[0].name : "Unknown";
};

// Compte les victoires d'un pilote
const fetchDriverWins = async (driverId: string) => {
  let wins = 0;
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const response = await fetch(
      `${API_BASE_URL}/drivers/${driverId}/results.json?limit=100&offset=${offset}`
    );
    const data = await response.json();
    const races = data.MRData.RaceTable.Races;
    wins += races.filter(
      (race: { Results: { position: string }[] }) =>
        race.Results[0].position === "1"
    ).length;
    hasMore = races.length === 100;
    offset += 100;
  }
  return wins;
};

export default updateDriversCache;
