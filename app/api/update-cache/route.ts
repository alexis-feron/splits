import { NextResponse } from "next/server";
import { updateDriversCache } from "@/app/utils/updateCache";

export async function POST() {
  try {
    await updateDriversCache();
    return NextResponse.json({
      success: true,
      message: "Cache updated successfully.",
    });
  } catch (error) {
    console.error("Error updating drivers cache:", error);
    return NextResponse.json(
      { error: "Failed to update cache." },
      { status: 500 }
    );
  }
}
