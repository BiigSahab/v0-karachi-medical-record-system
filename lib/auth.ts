import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode(
  process.env.STACK_SECRET_SERVER_KEY || process.env.JWT_SECRET || "your-secret-key-change-in-production",
)

export async function generateToken(userId: string, role: string, email: string) {
  const token = await new SignJWT({ userId, role, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret)
  return token
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch {
    return null
  }
}

export const ROLE_PERMISSIONS = {
  admin: ["view_all_users", "create_user", "edit_user", "delete_user", "view_all_records"],
  doctor: ["view_patients", "create_medical_record", "edit_medical_record", "view_lab_results"],
  patient: ["view_own_records", "view_own_lab_results"],
  lab_technician: ["upload_lab_results", "view_assigned_tests"],
  government: ["view_statistics", "view_anonymous_data"],
}

export function hasPermission(role: string, permission: string): boolean {
  return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]?.includes(permission) || false
}
