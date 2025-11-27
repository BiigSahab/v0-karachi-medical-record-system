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

    const districtData = await sql`
      SELECT district, SUM(case_count) as total_cases FROM kmrms.health_statistics 
      GROUP BY district ORDER BY total_cases DESC
    `

    return NextResponse.json(districtData)
  } catch (error) {
    console.error("Error fetching health data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
