"use strict";

const express = require("express");
const router = express.Router(); // ✅ THIS LINE WAS MISSING
const accounting = require("accounting");
const lodash = require("lodash");
const db = require("../models");
const sequelize = require("../config/database");

// Index route
router.get("/", async (req, res) => {
  console.log("📌 GET / route called");

  try {
    const allBooks = await db.Book.findAll({
      limit: 9,
      include: [db.Author],
    });

    const distinctCategory = await db.Book.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("genre")), "genre"]
      ]
    });

    const cartCount = await db.Cart.count();

    lodash.map(allBooks || [], (response) => {
      if (!response.dataValues) return response;
      const dataValues = response.dataValues;
      dataValues.price = accounting.formatMoney(dataValues.price || 0);
      dataValues.modalhref = "#modal-book-" + (dataValues.id || "unknown");
      dataValues.modalId = "modal-book-" + (dataValues.id || "unknown");
      return response;
    });

    res.render("index", {
      books: allBooks || [],
      categories: distinctCategory || [],
      cartCount: cartCount || 0,
    });
  } catch (err) {
    console.error("❌ Error in GET / route:", err);
    res.status(500).send("Server Error — " + err.message);
  }
});

module.exports = router;


