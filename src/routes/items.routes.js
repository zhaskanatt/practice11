const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");

const router = express.Router();

// GET /api/items
router.get("/", async (req, res) => {
  const items = await Item.find().sort({ createdAt: -1 });
  return res.json({ count: items.length, items });
});

// GET /api/items/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }

  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  return res.json(item);
});

// POST /api/items
router.post("/", async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || String(name).trim().length === 0) {
    return res.status(400).json({ message: "name is required" });
  }

  const created = await Item.create({
    name: String(name).trim(),
    description: description ?? "",
    price: price ?? 0
  });

  return res.status(201).json(created);
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }

  const update = {};
  if (req.body.name !== undefined) update.name = String(req.body.name).trim();
  if (req.body.description !== undefined) update.description = req.body.description;
  if (req.body.price !== undefined) update.price = req.body.price;

  const updated = await Item.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  });

  if (!updated) return res.status(404).json({ message: "Item not found" });

  return res.json(updated);
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid item id" });
  }

  const deleted = await Item.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Item not found" });

  return res.json({ message: "Item deleted", id });
});

module.exports = router;
