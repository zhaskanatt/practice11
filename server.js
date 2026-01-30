require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/db");
const itemsRoutes = require("./src/routes/items.routes");

const app = express();

app.use(cors());
app.use(express.json());

// GET /
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Routes
app.use("/api/items", itemsRoutes);

// Global error handler (keeps JSON responses)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 3000; // required style :contentReference[oaicite:4]{index=4}

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
