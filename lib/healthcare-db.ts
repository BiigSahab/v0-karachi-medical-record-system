import { sql } from "@/lib/db"

// Healthcare Database Utilities

export interface Doctor {
  Doctor_ID: number
  Doctor_SSN: string
  Name: string
  Phone_Number: bigint
}

export interface Patient {
  Patient_ID: number
  Patient_SSN: string
  Doctor_ID: number
  Name: string
  Gender: string
}

export interface Invoice {
  Invoice_Number: number
  Patient_ID: number
  CPT_ID: number
  Diagnosis_ID: number
  Amount: number
  Invoice_Date: string
  Prescription_ID: number
}

export interface Payment {
  Transaction_Number: number
  Invoice_Number: number
  Payment_Status: string
  Payment_Method: string
  Payment_Date: string
}

export interface Medicine {
  Medicine_Inventory_ID: number
  Medicine_Name: string
  Manufacturer: string
  Quantity: number
  Price: number
  Inventory_Value: number
}

// Get all patients
export async function getPatients() {
  try {
    const patients = await sql`SELECT * FROM healthcare.Patient ORDER BY Name`
    return patients || []
  } catch (error) {
    console.error("[v0] Error fetching patients:", error)
    return []
  }
}

// Get patient by ID
export async function getPatientById(patientId: number) {
  try {
    const result = await sql`SELECT * FROM healthcare.Patient WHERE Patient_ID = ${patientId}`
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error fetching patient:", error)
    return null
  }
}

// Get all doctors
export async function getDoctors() {
  try {
    const doctors = await sql`SELECT * FROM healthcare.Doctor ORDER BY Name`
    return doctors || []
  } catch (error) {
    console.error("[v0] Error fetching doctors:", error)
    return []
  }
}

// Get doctor by ID
export async function getDoctorById(doctorId: number) {
  try {
    const result = await sql`SELECT * FROM healthcare.Doctor WHERE Doctor_ID = ${doctorId}`
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error fetching doctor:", error)
    return null
  }
}

// Get invoices for patient
export async function getPatientInvoices(patientId: number) {
  try {
    const invoices = await sql`
      SELECT i.*, p.Name as Patient_Name, d.Diagnosis_Category
      FROM healthcare.Invoice i
      JOIN healthcare.Patient p ON i.Patient_ID = p.Patient_ID
      JOIN healthcare.Diagnosis d ON i.Diagnosis_ID = d.Diagnosis_ID
      WHERE i.Patient_ID = ${patientId}
      ORDER BY i.Invoice_Date DESC
    `
    return invoices || []
  } catch (error) {
    console.error("[v0] Error fetching invoices:", error)
    return []
  }
}

// Get payment history
export async function getPaymentHistory(patientId: number) {
  try {
    const payments = await sql`
      SELECT pa.*, i.Amount, p.Name as Patient_Name
      FROM healthcare.Payment pa
      JOIN healthcare.Invoice i ON pa.Invoice_Number = i.Invoice_Number
      JOIN healthcare.Patient p ON i.Patient_ID = p.Patient_ID
      WHERE i.Patient_ID = ${patientId}
      ORDER BY pa.Payment_Date DESC
    `
    return payments || []
  } catch (error) {
    console.error("[v0] Error fetching payment history:", error)
    return []
  }
}

// Get medicines
export async function getMedicines() {
  try {
    const medicines = await sql`SELECT * FROM healthcare.Medicine ORDER BY Medicine_Name`
    return medicines || []
  } catch (error) {
    console.error("[v0] Error fetching medicines:", error)
    return []
  }
}

// Get diagnoses
export async function getDiagnoses() {
  try {
    const diagnoses = await sql`SELECT * FROM healthcare.Diagnosis ORDER BY Diagnosis_Category`
    return diagnoses || []
  } catch (error) {
    console.error("[v0] Error fetching diagnoses:", error)
    return []
  }
}

// Get CPT codes
export async function getCPTCodes() {
  try {
    const cpts = await sql`SELECT * FROM healthcare.CPT ORDER BY CPT_ID`
    return cpts || []
  } catch (error) {
    console.error("[v0] Error fetching CPT codes:", error)
    return []
  }
}

// Create prescription
export async function createPrescription(patientId: number, prescriptionDate: string) {
  try {
    const result = await sql`
      INSERT INTO healthcare.Prescription (Patient_ID, Prescription_Date)
      VALUES (${patientId}, ${prescriptionDate})
      RETURNING *
    `
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error creating prescription:", error)
    return null
  }
}

// Create invoice
export async function createInvoice(
  patientId: number,
  cptId: number,
  diagnosisId: number,
  amount: number,
  invoiceDate: string,
  prescriptionId: number,
) {
  try {
    const result = await sql`
      INSERT INTO healthcare.Invoice (Patient_ID, CPT_ID, Diagnosis_ID, Amount, Invoice_Date, Prescription_ID)
      VALUES (${patientId}, ${cptId}, ${diagnosisId}, ${amount}, ${invoiceDate}, ${prescriptionId})
      RETURNING *
    `
    return result?.[0] || null
  } catch (error) {
    console.error("[v0] Error creating invoice:", error)
    return null
  }
}

// Get doctor's patients
export async function getDoctorPatients(doctorId: number) {
  try {
    const patients = await sql`
      SELECT * FROM healthcare.Patient 
      WHERE Doctor_ID = ${doctorId}
      ORDER BY Name
    `
    return patients || []
  } catch (error) {
    console.error("[v0] Error fetching doctor's patients:", error)
    return []
  }
}

// Get doctor paycheck history
export async function getDoctorPaychecks(doctorId: number) {
  try {
    const paychecks = await sql`
      SELECT * FROM healthcare.Paycheck
      WHERE Doctor_ID = ${doctorId}
      ORDER BY Pay_Date DESC
    `
    return paychecks || []
  } catch (error) {
    console.error("[v0] Error fetching paychecks:", error)
    return []
  }
}
