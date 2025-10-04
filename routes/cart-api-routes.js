"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");

console.log("🔗 Cart API routes loaded");

// GET all cart items
router.get("/", async (req, res) => {
  console.log("📌 GET /api/cart called");

  try {
    const carts = await db.Cart.findAll();
    console.log(`✅ Retrieved ${carts.length} cart items`);
    res.json(carts);
  } catch (err) {
    console.error("❌ Error fetching carts:", err);
    res.status(500).json({ error: "Failed to fetch carts" });
  }
});

module.exports = router;

