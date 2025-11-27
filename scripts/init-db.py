import os
import psycopg2

# Get database connection details from environment
db_url = os.getenv('DATABASE_URL')

if not db_url:
    print("ERROR: DATABASE_URL environment variable not set")
    exit(1)

try:
    # Connect to the database
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    print("[v0] Connected to database successfully")
    
    # Create schema
    cursor.execute("CREATE SCHEMA IF NOT EXISTS kmrms;")
    print("[v0] Schema created or already exists")
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kmrms.users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'patient', 'lab_technician', 'government')),
            cnic VARCHAR(15) UNIQUE,
            phone_number VARCHAR(20),
            address TEXT,
            district VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("[v0] Users table created")
    
    # Create patients table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kmrms.patients (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE REFERENCES kmrms.users(id) ON DELETE CASCADE,
            date_of_birth DATE,
            blood_type VARCHAR(5),
            medical_history TEXT,
            allergies TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("[v0] Patients table created")
    
    # Create medical_records table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kmrms.medical_records (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER REFERENCES kmrms.patients(id) ON DELETE CASCADE,
            doctor_id INTEGER REFERENCES kmrms.users(id) ON DELETE SET NULL,
            diagnosis TEXT NOT NULL,
            treatment TEXT,
            medications TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("[v0] Medical records table created")
    
    # Create lab_results table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kmrms.lab_results (
            id SERIAL PRIMARY KEY,
            patient_id INTEGER REFERENCES kmrms.patients(id) ON DELETE CASCADE,
            test_name VARCHAR(255) NOT NULL,
            result_file_url TEXT,
            lab_technician_id INTEGER REFERENCES kmrms.users(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("[v0] Lab results table created")
    
    # Create health_statistics table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kmrms.health_statistics (
            id SERIAL PRIMARY KEY,
            district VARCHAR(100) NOT NULL,
            total_patients INTEGER DEFAULT 0,
            total_records INTEGER DEFAULT 0,
            disease_cases VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    print("[v0] Health statistics table created")
    
    # Insert demo users (with bcrypt hashed 'password123')
    cursor.execute("""
        INSERT INTO kmrms.users (email, password_hash, full_name, role, cnic, phone_number, district)
        VALUES 
            ('admin@kmrms.pk', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMFOf', 'Admin User', 'admin', '12345-1234567-1', '03001234567', 'Karachi'),
            ('doctor@kmrms.pk', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMFOf', 'Dr. Ahmed Khan', 'doctor', '12346-1234567-1', '03011234567', 'Karachi'),
            ('patient@kmrms.pk', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMFOf', 'Patient User', 'patient', '12347-1234567-1', '03021234567', 'Karachi'),
            ('lab@kmrms.pk', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMFOf', 'Lab Technician', 'lab_technician', '12348-1234567-1', '03031234567', 'Karachi'),
            ('govt@kmrms.pk', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMFOf', 'Government Official', 'government', '12349-1234567-1', '03041234567', 'Karachi')
        ON CONFLICT (email) DO NOTHING;
    """)
    print("[v0] Demo users inserted")
    
    conn.commit()
    print("[v0] Database initialized successfully!")
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"ERROR: {str(e)}")
    exit(1)
