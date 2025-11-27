import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

async function seedUsers() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Hash passwords with bcrypt (salt rounds: 10)
    const hashedPasswords: { [key: string]: string } = {}
    const demoUsers = [
      { email: "admin@kmrms.pk", role: "admin", name: "Admin User" },
      { email: "doctor@kmrms.pk", role: "doctor", name: "Dr. Ahmed Khan" },
      { email: "patient@kmrms.pk", role: "patient", name: "Patient User" },
      { email: "lab@kmrms.pk", role: "lab_technician", name: "Lab Technician" },
      { email: "govt@kmrms.pk", role: "government", name: "Government Official" },
    ]

    // Create hashes
    for (const user of demoUsers) {
      hashedPasswords[user.email] = await bcrypt.hash("password123", 10)
    }

    // Delete existing demo users first
    await sql`DELETE FROM kmrms.users WHERE email IN ('admin@kmrms.pk', 'doctor@kmrms.pk', 'patient@kmrms.pk', 'lab@kmrms.pk', 'govt@kmrms.pk')`

    // Insert new users with proper hashes
    for (const user of demoUsers) {
      await sql`
        INSERT INTO kmrms.users (email, password_hash, role, full_name, created_at)
        VALUES (${user.email}, ${hashedPasswords[user.email]}, ${user.role}, ${user.name}, NOW())
      `
    }

    console.log("[v0] Demo users seeded successfully!")
    console.log("Test credentials:")
    console.log("- admin@kmrms.pk / password123")
    console.log("- doctor@kmrms.pk / password123")
    console.log("- patient@kmrms.pk / password123")
    console.log("- lab@kmrms.pk / password123")
    console.log("- govt@kmrms.pk / password123")
  } catch (error) {
    console.error("[v0] Error seeding users:", error)
    throw error
  }
}

seedUsers()
