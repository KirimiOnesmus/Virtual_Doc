
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `role` enum('patient','doctor','admin','super-admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `online` tinyint(1) DEFAULT '0',
  `membership_status` enum('Active','Not Active') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `users_chk_1` CHECK ((`role` in (_utf8mb4'patient',_utf8mb4'doctor',_utf8mb4'admin',_utf8mb4'super-admin')))
)
-- PATIENTS TABLE
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `phonenumber` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `bio` text,
  `county` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `insurance` varchar(100) DEFAULT NULL,
  `policy_number` varchar(100) DEFAULT NULL,
  `allergies` text,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `current_medication` text,
  `existing_condition` text,
  `emergency_name` varchar(100) DEFAULT NULL,
  `emergency_relationship` varchar(50) DEFAULT NULL,
  `emergency_contact` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
)

-- DOCTORS TABLE
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `bio` text,
  `phonenumber` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `affiliation` varchar(100) DEFAULT NULL,
  `county` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) 

-- APPOINTMENTS TABLE
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `appointment_time` timestamp NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `consultation_mode` varchar(10) DEFAULT NULL,
  `payment_status` varchar(10) DEFAULT NULL,
  `rescheduled_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `department` varchar(100) DEFAULT NULL,
  `symptoms` text,
  `time_slot_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `fk_timeslot` (`time_slot_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_timeslot` FOREIGN KEY (`time_slot_id`) REFERENCES `timeslots` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_chk_1` CHECK ((`status` in (_utf8mb4'pending',_utf8mb4'confirmed',_utf8mb4'cancelled',_utf8mb4'completed',_utf8mb4'not done'))),
  CONSTRAINT `appointments_chk_2` CHECK ((`consultation_mode` in (_utf8mb4'chat',_utf8mb4'video'))),
  CONSTRAINT `appointments_chk_3` CHECK ((`payment_status` in (_utf8mb4'unpaid',_utf8mb4'paid'))),
  CONSTRAINT `appointments_chk_4` CHECK ((`cancelled_by` in (_utf8mb4'doctor',_utf8mb4'patient')))
) 
-- PAYMENTS TABLE
CREATE TABLE `payments` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int NOT NULL,
  `patient_id` int DEFAULT NULL,
  `method` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `patient_id` (`patient_id`),
  KEY `payments_ibfk_1` (`appointment_id`),
  KEY `fk_payments_doctor` (`doctor_id`),
  CONSTRAINT `fk_payments_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_chk_1` CHECK ((`method` in (_utf8mb4'mpesa',_utf8mb4'airtel_money'))),
  CONSTRAINT `payments_chk_2` CHECK ((`status` in (_utf8mb4'success',_utf8mb4'failed',_utf8mb4'pending')))
)

-- MESSAGES TABLE
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `text` text,
  `attachment_url` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  KEY `appointment_id` (`appointment_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`)
) 

-- VIDEO SESSIONS TABLE
CREATE TABLE `video_sessions` (
  `id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `session_link` varchar(255) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `patient_id` (`patient_id`),
  KEY `video_sessions_ibfk_1` (`appointment_id`),
  CONSTRAINT `video_sessions_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_sessions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `video_sessions_ibfk_3` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) 
-- TREATMENTS TABLE
CREATE TABLE `treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `patient_id` int DEFAULT NULL,
  `diagnosis` text,
  `prescription` text,
  `notes` text,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `patient_id` (`patient_id`),
  KEY `treatments_ibfk_1` (`appointment_id`),
  CONSTRAINT `treatments_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `treatments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `treatments_ibfk_3` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) 

INSERT INTO users (id, name, email, password, role)
VALUES
(1, 'James Kariuki', 'james.kariuki@example.com', 'hashedpassword1', 'doctor'),
(2, 'Aisha Ahmed', 'aisha.ahmed@example.com', 'hashedpassword2', 'doctor'),
(3, 'Mercy Otieno', 'mercy.otieno@example.com', 'hashedpassword3', 'doctor'),
(4, 'Brian Mwangi', 'brian.mwangi@example.com', 'hashedpassword4', 'doctor'),
(5, 'Patrick Kimani', 'patrick.kimani@example.com', 'hashedpassword5', 'doctor');


-- Time slots
CREATE TABLE `timeslots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `is_booked` tinyint(1) DEFAULT '0',
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `day_of_week` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `timeslots_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) 
 
--  reviews
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `text` text NOT NULL,
  `rating` int NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  KEY `fk_user_review` (`user_id`),
  CONSTRAINT `fk_user_review` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) 


-- Weekly timeslots
CREATE TABLE `weekly_timeslots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `weekly_timeslots_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
)
-- Integrate authentication to determine who is the doctor/patient.

-- Use roomId or appointmentId in Socket.IO to isolate chats.

-- Store messages in a database for history.

-- Display user typing status.

-- Auto-scroll to the latest message.