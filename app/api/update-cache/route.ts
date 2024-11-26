import { updateDriversCache } from "@/app/utils/updateCache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Répondre immédiatement que la mise à jour a été lancée
    setTimeout(async () => {
      try {
        await updateDriversCache();
        console.log("Cache updated successfully.");
      } catch (error) {
        console.error("Error updating drivers cache:", error);
      }
    }, 0);

    return NextResponse.json({
      success: true,
      message: "Cache update in progress.",
    });
  } catch (error) {
    console.error("Error initiating cache update:", error);
    return NextResponse.json(
      { error: "Failed to initiate cache update." },
      { status: 500 }
    );
  }
}
