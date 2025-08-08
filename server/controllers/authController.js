const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  // console.log("Incoming data:", req.body);
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, passwordHash, role);

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log("Incoming data:", req.body);
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Invalid Credintials" });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid Credintials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login Failed" });
  }
};
module.exports = {
  registerUser,
  loginUser,
};
