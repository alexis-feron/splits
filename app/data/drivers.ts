import redis, { CACHE_KEY } from "@/app/utils/redis";
import { Driver } from "@/app/types/Driver";

export default async function Drivers(): Promise<void | Driver[]> {
  try {
    const data = await redis.json.get(CACHE_KEY);

    if (!data) {
      return undefined;
    }

    const drivers: Driver[] = data as Driver[];
    return drivers;
  } catch (error) {
    console.error("Error fetching drivers from Redis:", error);
    return;
  }
}
