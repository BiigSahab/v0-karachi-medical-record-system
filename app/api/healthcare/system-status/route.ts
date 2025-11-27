import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

    // Check database connectivity
    const dbCheck = await sql`SELECT 1`

    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM healthcare.Patient) as total_patients,
        (SELECT COUNT(*) FROM healthcare.Doctor) as total_doctors,
        (SELECT COUNT(*) FROM healthcare.Invoice) as total_records,
        (SELECT COUNT(*) FROM healthcare.Payment WHERE Payment_Status = 'SUCCESS') as total_invoices,
        (SELECT COUNT(*) FROM healthcare.Prescription) as total_prescriptions
    `

    return Response.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      statistics: stats[0],
    })
  } catch (error) {
    console.error("[v0] Error checking system status:", error)
    return Response.json(
      {
        status: "error",
        database: "disconnected",
        message: "System health check failed",
      },
      { status: 500 },
    )
  }
}
