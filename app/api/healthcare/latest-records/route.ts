import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 })

    // Using Invoice table instead of non-existent Record table
    const records = await sql`
      SELECT 
        inv.Invoice_Number as id,
        inv.Patient_ID,
        p.Name as patient_name,
        p.Patient_SSN as cnic,
        d.Diagnosis_Category as diagnosis,
        inv.Invoice_Date as record_date,
        inv.Amount
      FROM healthcare.Invoice inv
      JOIN healthcare.Patient p ON inv.Patient_ID = p.Patient_ID
      JOIN healthcare.Diagnosis d ON inv.Diagnosis_ID = d.Diagnosis_ID
      ORDER BY inv.Invoice_Date DESC
      LIMIT 10
    `

    return Response.json(records)
  } catch (error) {
    console.error("[v0] Error fetching latest records:", error)
    return Response.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}
