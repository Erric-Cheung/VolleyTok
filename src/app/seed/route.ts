import { NextResponse } from "next/server";
import { createActivitiesTable } from "@/lib/db/create-tables";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    await createActivitiesTable();

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
