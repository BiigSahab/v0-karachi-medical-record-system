-- Create schema for Karachi Medical Record Management System
CREATE SCHEMA IF NOT EXISTS kmrms;

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS kmrms.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  cnic TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'patient', 'lab_technician', 'government')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table with medical details
CREATE TABLE IF NOT EXISTS kmrms.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES kmrms.users(id) ON DELETE CASCADE,
  dob DATE NOT NULL,
  blood_type TEXT CHECK (blood_type IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
  area TEXT NOT NULL,
  city TEXT DEFAULT 'Karachi',
  phone TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical Records table
CREATE TABLE IF NOT EXISTS kmrms.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES kmrms.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES kmrms.users(id),
  diagnosis TEXT NOT NULL,
  prescription TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lab Results table
CREATE TABLE IF NOT EXISTS kmrms.lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES kmrms.patients(id) ON DELETE CASCADE,
  lab_technician_id UUID NOT NULL REFERENCES kmrms.users(id),
  test_type TEXT NOT NULL,
  result_data TEXT NOT NULL,
  result_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health Statistics table for Government
CREATE TABLE IF NOT EXISTS kmrms.health_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district TEXT NOT NULL,
  condition_name TEXT NOT NULL,
  case_count INTEGER DEFAULT 0,
  date_recorded DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON kmrms.users(email);
CREATE INDEX idx_users_role ON kmrms.users(role);
CREATE INDEX idx_patients_user_id ON kmrms.patients(user_id);
CREATE INDEX idx_medical_records_patient_id ON kmrms.medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id ON kmrms.medical_records(doctor_id);
CREATE INDEX idx_lab_results_patient_id ON kmrms.lab_results(patient_id);
CREATE INDEX idx_health_statistics_district ON kmrms.health_statistics(district);

-- Seed some initial data
INSERT INTO kmrms.users (email, password_hash, full_name, cnic, role, is_active) 
VALUES 
  ('admin@kmrms.pk', '$2a$10$YIvxH7U3VnvQa6Hl5sZ3POH2LU6QmJ7k8N4P6Q9R2S1T2U3V4W5X', 'Admin User', '12345-6789123-4', 'admin', true),
  ('doctor@kmrms.pk', '$2a$10$YIvxH7U3VnvQa6Hl5sZ3POH2LU6QmJ7k8N4P6Q9R2S1T2U3V4W5X', 'Dr. Ahmed Khan', '42101-1234567-8', 'doctor', true),
  ('patient@kmrms.pk', '$2a$10$YIvxH7U3VnvQa6Hl5sZ3POH2LU6QmJ7k8N4P6Q9R2S1T2U3V4W5X', 'Ali Hassan', '42102-9876543-2', 'patient', true),
  ('lab@kmrms.pk', '$2a$10$YIvxH7U3VnvQa6Hl5sZ3POH2LU6QmJ7k8N4P6Q9R2S1T2U3V4W5X', 'Lab Technician', '42103-1111111-1', 'lab_technician', true),
  ('govt@kmrms.pk', '$2a$10$YIvxH7U3VnvQa6Hl5sZ3POH2LU6QmJ7k8N4P6Q9R2S1T2U3V4W5X', 'Government Official', '42104-2222222-2', 'government', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample health statistics
INSERT INTO kmrms.health_statistics (district, condition_name, case_count)
VALUES 
  ('Karachi East', 'Dengue', 145),
  ('Karachi East', 'COVID-19', 32),
  ('Karachi West', 'Dengue', 98),
  ('Karachi Central', 'Malaria', 67)
ON CONFLICT DO NOTHING;
