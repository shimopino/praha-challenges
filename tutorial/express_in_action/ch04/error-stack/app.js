const express = require("express");
const morgan = require("morgan");

const PORT = 3000;
const app = express();

// ロギング用のミドルウェア
app.use(morgan("short"));

// ルーティング用のミドルウェア
app.use((req, res, next) => {
  if (req.url === "/") {
    next();
  } else if (req.url === "/throw") {
    throw new Error("Gimme that error");
  } else {
    next("you didn't visit the root");
  }
});

// ファイル送信用のミドルウェア
app.use((req, res) => {
  res.send("Welcome to the homepage");
});

// エラー時のロギング用のミドルウェア
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  next(err);
});

// エラー内容送信用のミドルウェア
app.use((err, req, res, next) => {
  res.send(`Got an error: ${err}`);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
