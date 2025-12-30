import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}

