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

    let patients
    if (payload.role === "doctor") {
      patients = await sql`
        SELECT DISTINCT p.id, u.id as user_id, u.email, u.full_name, u.cnic, p.blood_type, p.area, p.phone
        FROM kmrms.users u
        JOIN kmrms.patients p ON u.id = p.user_id
        JOIN kmrms.medical_records mr ON p.id = mr.patient_id
        WHERE mr.doctor_id = ${payload.userId}
      `
    } else {
      patients = await sql`
        SELECT p.id, u.id as user_id, u.email, u.full_name, u.cnic, p.blood_type, p.area, p.phone
        FROM kmrms.users u
        LEFT JOIN kmrms.patients p ON u.id = p.user_id
        WHERE u.role = 'patient'
      `
    }

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
