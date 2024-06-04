const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Ensuring that the upload directory exists
const uploadDir = path.join(__dirname, 'public/upload');
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Configuring multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to the original filename
  }
});
const upload = multer({ storage: storage });

//API endpoint to handle file uploads
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
