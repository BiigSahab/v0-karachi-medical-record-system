"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function HealthDataPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/health-data", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Error fetching health data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#0066cc", "#ff6b6b", "#ffa94d", "#51cf66", "#748ffc"]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Health Data Overview</h1>

      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading data...</Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cases by District</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} dataKey="total_cases" nameKey="district" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">District Summary</h2>
            <div className="space-y-3">
              {data.map((district: any) => (
                <div
                  key={district.district}
                  className="flex justify-between items-center pb-3 border-b border-border last:border-0"
                >
                  <span className="text-foreground">{district.district}</span>
                  <span className="font-semibold text-primary">{district.total_cases} cases</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
