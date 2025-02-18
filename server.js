const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve file statis

// Path ke file JSON
const messagesFilePath = path.join(__dirname, "messages.json");

// Endpoint untuk menyimpan pesan
app.post("/send-message", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong." });
  }

  // Baca file JSON yang ada
  fs.readFile(messagesFilePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).json({ error: "Gagal membaca file pesan." });
    }

    const messages = data ? JSON.parse(data) : [];
    messages.push({ message, timestamp: new Date().toISOString() });

    // Simpan pesan ke file JSON
    fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Gagal menyimpan pesan." });
      }

      res.json({ success: true, message: "Pesan berhasil dikirim!" });
    });
  });
});

// Endpoint untuk mengambil semua pesan
app.get("/get-messages", (req, res) => {
  fs.readFile(messagesFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Gagal membaca file pesan." });
    }

    const messages = data ? JSON.parse(data) : [];
    res.json(messages);
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});