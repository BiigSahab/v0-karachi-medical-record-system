"use client"
import { Card } from "@/components/ui/card"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="w-full max-w-md px-4">
        <Card className="p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">KMRMS</h1>
            <p className="text-muted-foreground">Karachi Medical Record Management System</p>
          </div>

          <LoginForm />

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong>Admin:</strong> admin@healthcare.pk
              </div>
              <div>
                <strong>Doctor:</strong> doctor@healthcare.pk
              </div>
              <div>
                <strong>Patient:</strong> patient@healthcare.pk
              </div>
              <div>
                <strong>Lab Tech:</strong> lab@healthcare.pk
              </div>
              <div>
                <strong>Government:</strong> govt@healthcare.pk
              </div>
              <div className="text-xs pt-2">
                <strong>Password (all):</strong> password123
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
