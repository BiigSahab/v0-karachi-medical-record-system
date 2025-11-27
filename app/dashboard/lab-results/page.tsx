"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TestTube, Download, Eye } from "lucide-react"

export default function LabResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/lab-results", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error("Error fetching lab results:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lab Results</h1>

      {loading ? (
        <Card className="p-8 text-center text-muted-foreground">Loading results...</Card>
      ) : results.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No lab results available</Card>
      ) : (
        <div className="space-y-4">
          {results.map((result: any) => (
            <Card key={result.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <TestTube className="text-primary mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold mb-1 capitalize">{result.test_type.replace("_", " ")}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(result.created_at).toLocaleDateString()} • Lab Tech: {result.lab_tech_name}
                    </p>
                    <p className="text-foreground">{result.result_data}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye size={16} />
                  </Button>
                  {result.result_pdf_url && (
                    <Button size="sm" variant="outline">
                      <Download size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
