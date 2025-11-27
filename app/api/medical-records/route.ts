import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const records = await sql`
      SELECT mr.*, u.full_name as doctor_name, p.user_id as patient_id
      FROM kmrms.medical_records mr
      JOIN kmrms.users u ON mr.doctor_id = u.id
      JOIN kmrms.patients p ON mr.patient_id = p.id
      ORDER BY mr.created_at DESC
    `

    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching records:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { patient_id, diagnosis, prescription, notes } = await request.json()

    const result = await sql`
      INSERT INTO kmrms.medical_records (patient_id, doctor_id, diagnosis, prescription, notes)
      VALUES (${patient_id}, ${payload.userId}, ${diagnosis}, ${prescription}, ${notes})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating record:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
