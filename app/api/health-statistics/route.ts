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
    if (!payload || payload.role !== "government") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const statistics = await sql`
      SELECT district, condition_name, case_count FROM kmrms.health_statistics 
      ORDER BY district, condition_name
    `

    return NextResponse.json(statistics)
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
