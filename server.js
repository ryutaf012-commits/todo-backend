const express = require("express");
const cors = require("cors");

//SQlite関連
const sqlite3 = require("sqlite3").verbose();
// DBファイル作成（なければ自動作成）
const db = new sqlite3.Database("./todos.db");
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT
    )
  `);
});

const app = express();

app.use(cors());
app.use(express.json());


// ① POST（追加）
app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  db.run("INSERT INTO todos (text) VALUES (?)", [text], function (err) {
    if (err) return res.status(500).send(err);

    res.json({ id: this.lastID, text });
  });
});

// ② GET（取得） 
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).send(err);

    res.json(rows);
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    res.json({ message: "削除OK" });
  });
});

// 最後に起動
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});