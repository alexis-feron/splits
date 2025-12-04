import Drivers from "@/app/services/drivers";
import { Driver } from "@/app/types/Driver";
import { NextResponse } from "next/server";

export async function GET() {
  const drivers = await Drivers();
  const driverNames = (drivers || []).map((driver: Driver) => driver.name);

  // Mélange aléatoire de la liste (algorithme Fisher-Yates)
  for (let i = driverNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [driverNames[i], driverNames[j]] = [driverNames[j], driverNames[i]];
  }

  return NextResponse.json(driverNames);
}
