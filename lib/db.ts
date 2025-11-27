import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export async function createUser(email: string, passwordHash: string, fullName: string, cnic: string, role: string) {
  const result = await sql`
    INSERT INTO kmrms.users (email, password_hash, full_name, cnic, role) 
    VALUES (${email}, ${passwordHash}, ${fullName}, ${cnic}, ${role}) 
    RETURNING id, email, full_name, role
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM kmrms.users WHERE email = ${email}`
  return result[0]
}

export async function getUserById(id: string) {
  const result = await sql`SELECT * FROM kmrms.users WHERE id = ${id}`
  return result[0]
}

export async function getAllUsers() {
  const result = await sql`
    SELECT id, email, full_name, cnic, role, is_active, created_at FROM kmrms.users ORDER BY created_at DESC
  `
  return result
}

export async function updateUser(id: string, data: Record<string, any>) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null

  const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`).join(", ")
  const values = [...Object.values(data), id]

  const result = await sql.query(
    `UPDATE kmrms.users SET ${setClauses}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  )
  return result[0]
}

export async function getPatientsByDoctor(doctorId: string) {
  const result = await sql`
    SELECT u.id, u.full_name, u.email, p.blood_type, p.area 
    FROM kmrms.users u 
    JOIN kmrms.patients p ON u.id = p.user_id 
    WHERE p.id IN (
      SELECT DISTINCT patient_id FROM kmrms.medical_records WHERE doctor_id = ${doctorId}
    ) 
    ORDER BY u.full_name
  `
  return result
}

export async function getMedicalRecords(patientId: string) {
  const result = await sql`
    SELECT mr.*, u.full_name as doctor_name 
    FROM kmrms.medical_records mr 
    JOIN kmrms.users u ON mr.doctor_id = u.id 
    WHERE mr.patient_id = ${patientId} 
    ORDER BY mr.created_at DESC
  `
  return result
}

export async function getLabResults(patientId: string) {
  const result = await sql`
    SELECT * FROM kmrms.lab_results 
    WHERE patient_id = ${patientId} 
    ORDER BY created_at DESC
  `
  return result
}

export async function getHealthStatistics(district: string) {
  const result = await sql`
    SELECT condition_name, case_count FROM kmrms.health_statistics 
    WHERE district = ${district}
  `
  return result
}
