const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

// 投稿されたエントリはローカルに格納する
const entries = [];
// Expressのローカル変数として保持できるように、参照を共有する
app.locals.entries = entries;

// ロギング用ミドルウェアを追加
app.use(logger("dev"));
// リクエストボディを取り扱いやすい形式に変換するミドルウェアを追加
// extendedオプションは、falseの場合はqueryStringライブラリを使用し、trueの場合はqsライブラリを使用する
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/new-entry", (req, res) => {
  res.render("new-entry");
});

app.post("/new-entry", (req, res) => {
  if (!req.body.title || !req.body.body) {
    res.status(400).send("Entries must have a title and a body");
    return;
  }
  entries.push({
    title: req.body.title,
    body: req.body.body,
    published: new Date()
  });
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404");
})

http.createServer(app).listen(3000);

