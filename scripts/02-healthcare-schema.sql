-- Healthcare Database Schema for Neon PostgreSQL
-- This replaces the KMRMS schema with the comprehensive healthcare system

-- Drop existing KMRMS schema if exists and create healthcare
DROP SCHEMA IF EXISTS healthcare CASCADE;
CREATE SCHEMA healthcare;

-- Doctor table
CREATE TABLE healthcare.Doctor (
  Doctor_ID SERIAL PRIMARY KEY,
  Doctor_SSN VARCHAR(10) UNIQUE NOT NULL,
  Name VARCHAR(30) NOT NULL,
  Phone_Number BIGINT NOT NULL CHECK (Phone_Number > 999999999 AND Phone_Number < 10000000000)
);

-- Patient table  
CREATE TABLE healthcare.Patient (
  Patient_ID SERIAL PRIMARY KEY,
  Patient_SSN VARCHAR(11) UNIQUE NOT NULL,
  Doctor_ID INT NOT NULL REFERENCES healthcare.Doctor(Doctor_ID) ON DELETE SET NULL,
  Name VARCHAR(30) NOT NULL,
  Gender VARCHAR(10) NOT NULL CHECK (Gender IN ('Male', 'Female'))
);

-- Paycheck table
CREATE TABLE healthcare.Paycheck (
  Cheque_Number SERIAL PRIMARY KEY,
  Doctor_ID INT NOT NULL REFERENCES healthcare.Doctor(Doctor_ID) ON DELETE CASCADE,
  Salary FLOAT CHECK(Salary >= 0),
  Bonus FLOAT CHECK(Bonus >= 0),
  Pay_Date DATE,
  Total_Pay FLOAT GENERATED ALWAYS AS (Salary + Bonus) STORED
);

-- Insurance company table
CREATE TABLE healthcare.Insurance (
  Company_ID SERIAL PRIMARY KEY,
  Company_Name VARCHAR(50) NOT NULL,
  Phone_Number BIGINT CHECK (Phone_Number > 999999999 AND Phone_Number < 10000000000)
);

-- Diagnosis table
CREATE TABLE healthcare.Diagnosis (
  Diagnosis_ID SERIAL PRIMARY KEY,
  Diagnosis_Category VARCHAR(50) NOT NULL,
  Base_Price FLOAT NOT NULL CHECK(Base_Price >= 0)
);

-- CPT codes table
CREATE TABLE healthcare.CPT (
  CPT_ID SERIAL PRIMARY KEY,
  CPT_Category VARCHAR(20),
  CPT_Price FLOAT NOT NULL CHECK(CPT_Price >= 0)
);

-- Medicine inventory table
CREATE TABLE healthcare.Medicine (
  Medicine_Inventory_ID SERIAL PRIMARY KEY,
  Medicine_Name VARCHAR(50) NOT NULL,
  Manufacturer VARCHAR(50) NOT NULL,
  Quantity INT CHECK (Quantity >= 0),
  Price FLOAT NOT NULL CHECK (Price >= 0),
  Inventory_Value FLOAT GENERATED ALWAYS AS (Quantity * Price) STORED
);

-- Prescription table
CREATE TABLE healthcare.Prescription (
  Prescription_ID SERIAL PRIMARY KEY,
  Patient_ID INT NOT NULL REFERENCES healthcare.Patient(Patient_ID) ON DELETE CASCADE,
  Prescription_Date DATE DEFAULT CURRENT_DATE
);

-- Prescribe Medicine associative entity
CREATE TABLE healthcare.Prescribe_Medicine (
  Prescription_ID INT NOT NULL REFERENCES healthcare.Prescription(Prescription_ID) ON DELETE CASCADE,
  Medicine_Inventory_ID INT NOT NULL REFERENCES healthcare.Medicine(Medicine_Inventory_ID) ON DELETE CASCADE,
  Quantity INT CHECK(Quantity >= 0),
  PRIMARY KEY (Prescription_ID, Medicine_Inventory_ID)
);

-- Invoice table
CREATE TABLE healthcare.Invoice (
  Invoice_Number SERIAL PRIMARY KEY,
  Patient_ID INT NOT NULL REFERENCES healthcare.Patient(Patient_ID) ON DELETE CASCADE,
  CPT_ID INT NOT NULL REFERENCES healthcare.CPT(CPT_ID) ON DELETE SET NULL,
  Diagnosis_ID INT NOT NULL REFERENCES healthcare.Diagnosis(Diagnosis_ID) ON DELETE SET NULL,
  Amount FLOAT NOT NULL,
  Invoice_Date DATE DEFAULT CURRENT_DATE,
  Prescription_ID INT REFERENCES healthcare.Prescription(Prescription_ID) ON DELETE SET NULL
);

-- Payment table
CREATE TABLE healthcare.Payment (
  Transaction_Number BIGSERIAL PRIMARY KEY,
  Invoice_Number INT NOT NULL REFERENCES healthcare.Invoice(Invoice_Number) ON DELETE CASCADE,
  Payment_Status VARCHAR(15) CHECK(Payment_Status IN ('FAILED', 'PENDING', 'SUCCESS')),
  Payment_Method VARCHAR(20) CHECK(Payment_Method IN ('Online Banking', 'Card', 'Cash')),
  Payment_Date DATE DEFAULT CURRENT_DATE
);

-- CoveredBy associative entity (Patient - Insurance relationship)
CREATE TABLE healthcare.CoveredBy (
  Patient_ID INT NOT NULL REFERENCES healthcare.Patient(Patient_ID) ON DELETE CASCADE,
  Company_ID INT REFERENCES healthcare.Insurance(Company_ID) ON DELETE SET NULL,
  Insurance_Serial_Number VARCHAR(20),
  Insurance_Expiry_Date DATE,
  PRIMARY KEY (Patient_ID)
);

-- Authentication users table (for the app)
CREATE TABLE healthcare.App_Users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient', 'lab_technician', 'government')),
  doctor_id INT REFERENCES healthcare.Doctor(Doctor_ID) ON DELETE SET NULL,
  patient_id INT REFERENCES healthcare.Patient(Patient_ID) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_doctor_id ON healthcare.Patient(Doctor_ID);
CREATE INDEX idx_patient_id ON healthcare.Invoice(Patient_ID);
CREATE INDEX idx_invoice_date ON healthcare.Invoice(Invoice_Date);
CREATE INDEX idx_payment_status ON healthcare.Payment(Payment_Status);
CREATE INDEX idx_medicine_name ON healthcare.Medicine(Medicine_Name);

-- Seed initial users for testing
INSERT INTO healthcare.App_Users (email, role, is_active) VALUES
  ('admin@healthcare.pk', 'admin', true),
  ('doctor@healthcare.pk', 'doctor', true),
  ('patient@healthcare.pk', 'patient', true),
  ('lab@healthcare.pk', 'lab_technician', true),
  ('govt@healthcare.pk', 'government', true);
