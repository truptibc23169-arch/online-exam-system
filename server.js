require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ✅ MongoDB URI check (IMPORTANT FIX)
const uri = process.env.MONGODB_URI;

if (!uri || !uri.startsWith("mongodb")) {
  console.error("❌ Invalid or missing MONGODB_URI");
  process.exit(1);
}

const client = new MongoClient(uri);
let db;

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await db.collection("users").findOne({ email });

    if (user) return res.status(400).send("User already exists");

    await db.collection("users").insertOne({ name, email, password });

    res.send("Registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email, password });

    if (!user) return res.status(401).send("Invalid credentials");

    res.send("Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ================= START SERVER =================
async function start() {
  try {
    await client.connect();
    db = client.db("online_exam");

    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log("🚀 Server running on port " + PORT);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

start();