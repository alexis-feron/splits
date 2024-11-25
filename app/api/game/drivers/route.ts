import drivers from "@/app/data/drivers";
import { Driver } from "@/app/types/Driver";
import { NextResponse } from "next/server";

export async function GET() {
  const driverNames = drivers.map((driver: Driver) => driver.name);
  return NextResponse.json(driverNames);
}
