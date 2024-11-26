import { Driver } from "@/app/types/Driver";
import redis, { CACHE_KEY } from "@/app/utils/redis";

let cachedDrivers: Driver[] | null = null;

export const getDrivers = async (): Promise<Driver[]> => {
  if (cachedDrivers) return cachedDrivers;

  const data = await redis.json.get(CACHE_KEY);
  if (!data) throw new Error("No drivers found in Redis");

  cachedDrivers = data as Driver[];
  return cachedDrivers;
};

export default getDrivers;
