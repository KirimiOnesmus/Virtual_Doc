
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('patient', 'doctor', 'admin', 'super_admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENTS TABLE
CREATE TABLE patients (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    profile_photo VARCHAR(255)
);

-- DOCTORS TABLE
CREATE TABLE doctors (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(255),
    bio TEXT,
    license_number VARCHAR(50),
    availability JSON,
    profile_photo VARCHAR(255)
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  department VARCHAR(100),
  time_slot DATETIME NOT NULL,
  symptoms TEXT,
  consultation_type ENUM('chat', 'video') NOT NULL,
  status ENUM('pending', 'approved', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
-- PAYMENTS TABLE
CREATE TABLE payments (
    id INT PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    method VARCHAR(20) CHECK (method IN ('mpesa', 'airtel_money')),
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status VARCHAR(20) CHECK (status IN ('success', 'failed', 'pending')),
    paid_at TIMESTAMP
);

-- MESSAGES TABLE
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  appointment_id INT,
  message TEXT,
  file_url VARCHAR(255),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- VIDEO SESSIONS TABLE
CREATE TABLE video_sessions (
    id INT PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id) ON DELETE CASCADE,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    session_link VARCHAR(255),
    started_at TIMESTAMP,
    ended_at TIMESTAMP
);

-- TREATMENTS TABLE
CREATE TABLE treatments (
    id INT PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES users(id) ON DELETE CASCADE,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    diagnosis TEXT,
    prescription TEXT,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password, role)
VALUES
(1, 'James Kariuki', 'james.kariuki@example.com', 'hashedpassword1', 'doctor'),
(2, 'Aisha Ahmed', 'aisha.ahmed@example.com', 'hashedpassword2', 'doctor'),
(3, 'Mercy Otieno', 'mercy.otieno@example.com', 'hashedpassword3', 'doctor'),
(4, 'Brian Mwangi', 'brian.mwangi@example.com', 'hashedpassword4', 'doctor'),
(5, 'Patrick Kimani', 'patrick.kimani@example.com', 'hashedpassword5', 'doctor');

CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  doctor_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);


-- Integrate authentication to determine who is the doctor/patient.

-- Use roomId or appointmentId in Socket.IO to isolate chats.

-- Store messages in a database for history.

-- Display user typing status.

-- Auto-scroll to the latest message.