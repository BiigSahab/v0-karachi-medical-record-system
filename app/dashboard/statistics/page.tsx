"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function StatisticsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/health-statistics", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const statistics = await response.json()
        setData(statistics)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { district: "Karachi East", dengue: 145, covid: 32, malaria: 0 },
    { district: "Karachi West", dengue: 98, covid: 18, malaria: 15 },
    { district: "Karachi Central", dengue: 67, covid: 12, malaria: 45 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Health Statistics</h1>

      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading statistics...</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Cases" value="1,234" description="Across all districts" />
            <StatCard title="Dengue Cases" value="310" description="Active cases" />
            <StatCard title="Recovery Rate" value="94.2%" description="Overall recovery" />
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Disease Distribution by District</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="dengue" fill="#0066cc" name="Dengue" />
                <Bar dataKey="covid" fill="#ff6b6b" name="COVID-19" />
                <Bar dataKey="malaria" fill="#ffa94d" name="Malaria" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  )
}

function StatCard({ title, value, description }: any) {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </Card>
  )
}
