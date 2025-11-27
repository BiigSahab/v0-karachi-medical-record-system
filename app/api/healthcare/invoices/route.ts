import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID required" }, { status: 400 })
    }

    const invoices = await sql`
      SELECT i.*, p.Name as Patient_Name, d.Diagnosis_Category
      FROM healthcare.Invoice i
      JOIN healthcare.Patient p ON i.Patient_ID = p.Patient_ID
      JOIN healthcare.Diagnosis d ON i.Diagnosis_ID = d.Diagnosis_ID
      WHERE i.Patient_ID = ${Number.parseInt(patientId)}
      ORDER BY i.Invoice_Date DESC
    `
    return NextResponse.json(invoices || [])
  } catch (error) {
    console.error("[v0] Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
