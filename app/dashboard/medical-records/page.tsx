"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/my-medical-records", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Medical Records</h1>

      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading records...</Card>
      ) : records.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No medical records found</Card>
      ) : (
        <div className="space-y-4">
          {records.map((record: any) => (
            <Card key={record.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-primary" size={20} />
                    <h3 className="text-lg font-semibold">Record from {record.doctor_name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(record.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
                  <p className="text-foreground">{record.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Doctor</p>
                  <p className="text-foreground">{record.doctor_name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Prescription</p>
                <p className="text-foreground whitespace-pre-wrap">{record.prescription}</p>
              </div>

              {record.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground">{record.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
