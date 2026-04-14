const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 MongoDB Connection
const uri = "mongodb://truptibc23169_db_user:yj0dVCuyazToL8N0@ac-zrftbyh-shard-00-00.ddqaf5f.mongodb.net:27017,ac-zrftbyh-shard-00-01.ddqaf5f.mongodb.net:27017,ac-zrftbyh-shard-00-02.ddqaf5f.mongodb.net:27017/?ssl=true&replicaSet=atlas-qrfnyz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

let db;

async function startServer() {
  await client.connect();
  db = client.db("online_exam");

  console.log("✅ Connected to MongoDB");

  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
}

startServer();

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.send("User already exists");
    }

    await db.collection("users").insertOne({ name, email, password });
    res.send("User registered successfully");
  } catch (err) {
    res.status(500).send("Error saving user");
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email, password });

    if (!user) {
      return res.send("Invalid email or password");
    }

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});