const express = require("express");
const path = require("path");

const app = express();

// Вказуємо Express використовувати статичні файли з папки FRONTEND
app.use(express.static(path.join(__dirname, "FRONTEND")));

// Обробляємо запит на кореневий шлях і віддаємо index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "FRONTEND", "index.html"));
});

const PORT = 3000;

app.listen(3000, () => {
  console.log(`server is working: http://localhost:${PORT}`);
});
