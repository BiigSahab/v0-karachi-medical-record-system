import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const patients = await sql`
      SELECT p.*, d.Name as Doctor_Name
      FROM healthcare.Patient p
      LEFT JOIN healthcare.Doctor d ON p.Doctor_ID = d.Doctor_ID
      ORDER BY p.Name
    `
    return NextResponse.json(patients || [])
  } catch (error) {
    console.error("[v0] Error fetching patients:", error)
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}
