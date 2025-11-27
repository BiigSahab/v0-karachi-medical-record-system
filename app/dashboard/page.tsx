"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, TestTube, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [latestRecords, setLatestRecords] = useState<any[]>([])
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth_token")

      const recordsResponse = await fetch("/api/healthcare/latest-records", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (recordsResponse.ok) {
        const recordsData = await recordsResponse.json()
        setLatestRecords(recordsData)
      }

      const statusResponse = await fetch("/api/healthcare/system-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setSystemStatus(statusData)
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user.fullName}</h1>
        <p className="text-muted-foreground capitalize">Role: {user.role.replace("_", " ")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          icon={<Users className="w-8 h-8" />}
          title="Total Patients"
          value={systemStatus?.statistics?.total_patients || "0"}
          description="In system"
        />
        <DashboardCard
          icon={<FileText className="w-8 h-8" />}
          title="Medical Records"
          value={systemStatus?.statistics?.total_records || "0"}
          description="On file"
        />
        <DashboardCard
          icon={<TestTube className="w-8 h-8" />}
          title="Prescriptions"
          value={systemStatus?.statistics?.total_prescriptions || "0"}
          description="Active"
        />
        <DashboardCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="System Status"
          value={systemStatus?.status === "healthy" ? "Healthy" : "Offline"}
          description={systemStatus?.database === "connected" ? "Connected" : "Disconnected"}
          isStatus={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Records */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Latest Records</h2>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/records")}>
              View All
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          ) : latestRecords.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No records found</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {latestRecords.slice(0, 5).map((record: any) => (
                <div key={record.RecordID} className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-sm">{record.PatientName}</p>
                  <p className="text-xs text-muted-foreground">CNIC: {record.CNIC}</p>
                  <p className="text-xs text-muted-foreground mt-1">{record.DiagnosisName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(record.RecordDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* System Status */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Status</h2>
            <Button variant="outline" size="sm" onClick={fetchData}>
              Refresh
            </Button>
          </div>
          {systemStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Database</span>
                <div className="flex items-center gap-2">
                  {systemStatus.database === "connected" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm capitalize">{systemStatus.database}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center gap-2">
                  {systemStatus.status === "healthy" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm capitalize">{systemStatus.status}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                Last updated: {new Date(systemStatus.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          )}
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({ icon, title, value, description, isStatus }: any) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className={isStatus ? "text-yellow-600" : "text-primary"}>{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mt-4 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </Card>
  )
}
