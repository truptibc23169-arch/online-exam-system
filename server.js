const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ⭐ Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ⭐ Open login page as default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// MongoDB
const uri = "YOUR_MONGODB_URL";
const client = new MongoClient(uri);

let db;

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    await db.collection("users").insertOne({ name, email, password });
    res.send("User registered successfully");

  } catch (err) {
    res.status(500).send("Error");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email, password });

    if (!user) {
      return res.status(401).send("Invalid login");
    }

    res.send("Login successful");

  } catch (err) {
    res.status(500).send("Error");
  }
});

// START SERVER
async function startServer() {
  await client.connect();
  db = client.db("online_exam");

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
}

startServer();