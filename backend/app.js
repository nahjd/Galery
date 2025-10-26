require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const connectDB = require("./config/db");
const photoRoutes = require("./router/photoRouter");
const Photo = require("./models/photoModels");

const app = express();
const PORT = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.use("/api", photoRoutes);

app.get("/", (req, res) => res.send("OK"));

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "File is required" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

connectDB(process.env.MONGODB_URI)
  .then(async () => {
    await Photo.createCollection();  // boş olsa belə DB görünsün
    console.log("✅ 'photos' collection ensured");
    app.listen(PORT, () => console.log(`🚀 Server on :${PORT}`));
  })
  .catch((e) => { console.error("DB connect error:", e); process.exit(1); });
