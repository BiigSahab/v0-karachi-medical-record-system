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

    let results
    if (payload.role === "patient") {
      results = await sql`
        SELECT lr.*, u.full_name as lab_tech_name
        FROM kmrms.lab_results lr
        JOIN kmrms.users u ON lr.lab_technician_id = u.id
        WHERE lr.patient_id IN (
          SELECT id FROM kmrms.patients WHERE user_id = ${payload.userId}
        )
        ORDER BY lr.created_at DESC
      `
    } else {
      results = await sql`
        SELECT lr.*, u.full_name as lab_tech_name
        FROM kmrms.lab_results lr
        JOIN kmrms.users u ON lr.lab_technician_id = u.id
        ORDER BY lr.created_at DESC
      `
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching lab results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "lab_technician") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { patient_id, test_type, result_data, result_pdf_url } = await request.json()

    // Simple UUID validation regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(patient_id)) {
      return NextResponse.json({ error: "Invalid patient ID format" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO kmrms.lab_results (patient_id, lab_technician_id, test_type, result_data, result_pdf_url)
      VALUES (${patient_id}::uuid, ${payload.userId}::uuid, ${test_type}, ${result_data}, ${result_pdf_url})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating lab result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
