const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({ message: "CRM backend is alive" });
});

module.exports = app;