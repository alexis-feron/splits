import { Driver } from "@/app/types/Driver";
import redis, { CACHE_KEY } from "@/app/utils/redis";

let cachedDrivers: Driver[] | null = null;

export const getDrivers = async (): Promise<Driver[]> => {
  if (cachedDrivers) return cachedDrivers;

  const data = await redis.json.get(CACHE_KEY);
  if (!data) throw new Error("No drivers found in Redis");

  // Normaliser les données : convertir objet avec clés numériques en tableau
  let drivers: Driver[];
  if (Array.isArray(data)) {
    drivers = data;
  } else if (typeof data === 'object' && data !== null) {
    // Convertir l'objet {"0": {...}, "1": {...}} en tableau
    drivers = Object.values(data);
  } else {
    throw new Error("Invalid drivers format in Redis");
  }

  cachedDrivers = drivers;
  return cachedDrivers;
};

export default getDrivers;
