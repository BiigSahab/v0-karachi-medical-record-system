import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const medicines = await sql`
      SELECT * FROM healthcare.Medicine
      ORDER BY Medicine_Name
    `
    return NextResponse.json(medicines || [])
  } catch (error) {
    console.error("[v0] Error fetching medicines:", error)
    return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 })
  }
}
