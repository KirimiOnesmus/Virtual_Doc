const bcrypt = require("bcrypt");
const { findUserById } = require("../models/userModel");
const db = require("../config/db");
const { createUser, findUserByEmail } = require("../models/userModel");


const registerDoctor = async (req, res) => {
  const { name, email, password } = req.body;
  //   console.log("Incoming doctor data:", req.body);
  //   console.log("Authenticated user:", req.user);
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, passwordHash, "doctor");

    res.status(201).json({ message: "Doctor registered successfully", userId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getUserById = async (req, res) => {
  const userId = req.params.id;
  console.log("/users/:id route hit");
  console.log("Authorization header:", req.headers.authorization);
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    // console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getMyProfile = async (req, res) => {
  const userId = req.user.id;
  // console.log("User ID:", userId);

  try {
    const user = await findUserById(userId);
    // console.log("User from DB:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //fetching doctor
    const [doctorRows] = await db.execute(
      "SELECT * FROM doctors WHERE user_id = ?",
      [userId]
    );
    //fetching patient
    const [patientRows] = await db.execute(
      "SELECT * FROM patients WHERE user_id = ?",
      [userId]
    );

    const doctor = doctorRows.length > 0 ? doctorRows[0] : null;
    const patient = patientRows.length > 0 ? patientRows[0] : null;
    res.status(200).json({ ...user, doctor, patient });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updatedProfile = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const data = req.body;
  console.log("📦 Data received:", req.body);
  try {
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   // If an avatar file is uploaded, save the path in `users.avatar`
    if (req.file) {
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      await db.execute("UPDATE users SET avatar = ? WHERE id = ?", [
        avatarPath,
        userId,
      ]);
    }

    // Update doctor profile
    if (role === "doctor") {
      const {
        phonenumber = null,
        gender = null,
        specialty = null,
        license_number = null,
        years_of_experience = null,
        affiliation = null,
        bio = null,
        county = null,
        address = null,
      } = data;

      const years =
        years_of_experience === "" ? null : parseInt(years_of_experience);
      const [existing] = await db.execute(
        "SELECT * FROM doctors WHERE user_id = ?",
        [userId]
      );

      if (existing.length > 0) {
        await db.execute(
          `UPDATE doctors SET phonenumber = ?, gender = ?, specialty = ?, license_number = ?, years_of_experience = ?, affiliation = ?, bio = ?, county = ?, address = ? WHERE user_id = ?`,
          [
            phonenumber,
            gender,
            specialty,
            license_number,
            years,
            affiliation,
            bio,
            county,
            address,
            userId,
          ]
        );
      } else {
        await db.execute(
          `INSERT INTO doctors (user_id, phonenumber, gender, specialty, license_number, years_of_experience, affiliation, bio, county, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            phonenumber,
            gender,
            specialty,
            license_number,
            years,
            affiliation,
            bio,
            county,
            address,
          ]
        );
      }

      return res
        .status(200)
        .json({ message: "Doctor profile updated successfully" });
    }

    // Update patient profile
    if (role === "patient") {
      const {
        phonenumber = null,
        gender = null,
        bio = null,
        county = null,
        address = null,
        date_of_birth = null,
        insurance = null,
        policy_number = null,
        allergies = null,
        blood_group = null,
        current_medication = null,
        existing_condition = null,
        emergency_name = null,
        emergency_relationship = null,
        emergency_contact = null,
      } = data;
      const normalize = (value) => (value === "" ? null : value);
      const [existing] = await db.execute(
        "SELECT * FROM patients WHERE user_id = ?",
        [userId]
      );

      if (existing.length > 0) {
        await db.execute(
          `UPDATE patients SET phonenumber = ?, gender = ?, bio = ?, county = ?, address = ?, date_of_birth = ?, insurance = ?, policy_number = ?, allergies = ?, blood_group = ?, current_medication = ?, existing_condition = ?, emergency_name = ?, emergency_relationship = ?, emergency_contact = ? WHERE user_id = ?`,
          [
            normalize(phonenumber),
            normalize(gender),
            normalize(bio),
            normalize(county),
            normalize(address),
            normalize(date_of_birth),
            normalize(insurance),
            normalize(policy_number),
            normalize(allergies),
            normalize(blood_group),
            normalize(current_medication),
            normalize(existing_condition),
            normalize(emergency_name),
            normalize(emergency_relationship),
            normalize(emergency_contact),
            userId,
          ]
        );
      } else {
        await db.execute(
          `INSERT INTO patients (user_id, phonenumber, gender, bio, county, address, date_of_birth, insurance, policy_number, allergies, blood_group, current_medication, existing_condition, emergency_name, emergency_relationship, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            normalize(phonenumber),
            normalize(gender),
            normalize(bio),
            normalize(county),
            normalize(address),
            normalize(date_of_birth),
            normalize(insurance),
            normalize(policy_number),
            normalize(allergies),
            normalize(blood_group),
            normalize(current_medication),
            normalize(existing_condition),
            normalize(emergency_name),
            normalize(emergency_relationship),
            normalize(emergency_contact),
          ]
        );
      }

      return res
        .status(200)
        .json({ message: "Patient profile updated successfully" });
    }

    return res.status(400).json({ message: "Invalid user role" });
  } catch (error) {
    console.error("Update error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerDoctor,
  getUserById,
  getMyProfile,
  updatedProfile,
};
