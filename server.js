require("dotenv").config();

const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found");
  process.exit(1);
}

const client = new MongoClient(uri);
let db;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});