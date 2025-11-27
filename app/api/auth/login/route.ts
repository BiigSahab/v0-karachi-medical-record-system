import { sql } from "@/lib/db"
import { generateToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

// Demo credentials - hardcoded for testing
const DEMO_USERS: Record<string, { password: string; role: string; fullName: string }> = {
  "admin@healthcare.pk": { password: "password123", role: "admin", fullName: "Admin User" },
  "doctor@healthcare.pk": { password: "password123", role: "doctor", fullName: "Dr. Akshay" },
  "patient@healthcare.pk": { password: "password123", role: "patient", fullName: "John" },
  "lab@healthcare.pk": { password: "password123", role: "lab_technician", fullName: "Lab Technician" },
  "govt@healthcare.pk": { password: "password123", role: "government", fullName: "Government Official" },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)

    // Check against demo credentials
    const demoUser = DEMO_USERS[email]
    if (!demoUser || demoUser.password !== password) {
      console.log("[v0] Invalid credentials for:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Credentials valid for:", email)

    // Check if user exists in database
    let userData
    try {
      const users = await sql`SELECT * FROM healthcare.App_Users WHERE email = ${email}`
      if (users && users.length > 0) {
        userData = users[0]
      } else {
        // Create user in database if they don't exist
        const result = await sql`
          INSERT INTO healthcare.App_Users (email, role, is_active)
          VALUES (${email}, ${demoUser.role}, true)
          ON CONFLICT (email) DO UPDATE SET is_active = true
          RETURNING *
        `
        userData = result?.[0]
      }
    } catch (dbError) {
      console.log("[v0] Database error:", dbError)
      // If database fails, still allow login with demo credentials
      userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role: demoUser.role,
      }
    }

    const token = await generateToken(userData?.id || email, userData?.role || demoUser.role, email)
    console.log("[v0] Token generated successfully")

    const response = NextResponse.json({
      token,
      user: {
        id: userData?.id || email,
        email,
        fullName: demoUser.fullName,
        role: userData?.role || demoUser.role,
      },
    })

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
