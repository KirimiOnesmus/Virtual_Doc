const db = require("../config/db");
const express = require("express");

const createUser = async (name, email, passwordHash, role) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ( ?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

//Finding User by Email

const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};
const findUserById = async (id) => {
  const sql = "SELECT id, name, email, role, avatar FROM users WHERE id = ?";
  //  console.log("Looking for user with ID:", id);
  const [rows] = await db.query(sql, [id]);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
