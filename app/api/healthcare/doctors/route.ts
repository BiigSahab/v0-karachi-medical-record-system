import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const doctors = await sql`
      SELECT * FROM healthcare.Doctor
      ORDER BY Name
    `
    return NextResponse.json(doctors || [])
  } catch (error) {
    console.error("[v0] Error fetching doctors:", error)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
