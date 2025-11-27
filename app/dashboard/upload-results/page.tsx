"use client"

import type React from "react"
import useSWR from "swr"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileUp } from "lucide-react"

export default function UploadResultsPage() {
  const [formData, setFormData] = useState({
    patient_id: "",
    test_type: "",
    result_data: "",
    pdf_file: null,
  })
  const [loading, setLoading] = useState(false)

  const { data: patients = [] } = useSWR("/api/patients", (url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    }).then((res) => res.json()),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/lab-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: formData.patient_id, // Now this is the actual patient UUID
          test_type: formData.test_type,
          result_data: formData.result_data,
          result_pdf_url: null,
        }),
      })

      if (response.ok) {
        setFormData({ patient_id: "", test_type: "", result_data: "", pdf_file: null })
        alert("Lab results uploaded successfully")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error uploading results:", error)
      alert("Error uploading results")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Upload Lab Results</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Patient</label>
            <Select
              value={formData.patient_id}
              onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient: any) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.full_name} ({patient.cnic})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Type</label>
            <Select
              value={formData.test_type}
              onValueChange={(value) => setFormData({ ...formData, test_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blood_work">Blood Work</SelectItem>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="ct_scan">CT Scan</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
                <SelectItem value="covid_test">COVID Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Result Data</label>
            <Textarea
              value={formData.result_data}
              onChange={(e) => setFormData({ ...formData, result_data: e.target.value })}
              placeholder="Enter result details"
              required
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attach PDF (Optional)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <FileUp className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PDF up to 10MB</p>
              <input type="file" accept=".pdf" className="hidden" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || !formData.patient_id} className="gap-2">
              <Upload size={18} />
              {loading ? "Uploading..." : "Upload Results"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
