import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

async function seedUsers() {
  try {
    console.log("[v0] Starting to seed demo users...")

    // Hash passwords for demo users
    const password = "password123"
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log("[v0] Hashed password created")

    const users = [
      {
        email: "admin@kmrms.pk",
        fullName: "Admin User",
        role: "admin",
        passwordHash: hashedPassword,
      },
      {
        email: "doctor@kmrms.pk",
        fullName: "Dr. Ahmed Khan",
        role: "doctor",
        passwordHash: hashedPassword,
      },
      {
        email: "patient@kmrms.pk",
        fullName: "Patient User",
        role: "patient",
        passwordHash: hashedPassword,
      },
      {
        email: "lab@kmrms.pk",
        fullName: "Lab Technician",
        role: "lab_technician",
        passwordHash: hashedPassword,
      },
      {
        email: "govt@kmrms.pk",
        fullName: "Government Official",
        role: "government",
        passwordHash: hashedPassword,
      },
    ]

    // Delete existing users and insert new ones
    await sql`DELETE FROM kmrms.users`
    console.log("[v0] Cleared existing users")

    for (const user of users) {
      await sql`
        INSERT INTO kmrms.users (email, full_name, role, password_hash, created_at, updated_at)
        VALUES (${user.email}, ${user.fullName}, ${user.role}, ${user.passwordHash}, NOW(), NOW())
      `
      console.log(`[v0] Created user: ${user.email}`)
    }

    console.log("[v0] Demo users seeded successfully!")
  } catch (error) {
    console.error("[v0] Error seeding users:", error)
    process.exit(1)
  }
}

seedUsers()
