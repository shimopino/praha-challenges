const express = require('express');
const http = require('http');

const app = express();

// ロギング用のミドルウェア
app.use((req, res, next) => {
  console.log('In comes a request to: ' + req.url);
  next();
});

// リクエスト処理用のミドルウェア
app.use((req, res) => {
  res.writeHead(200, {'Content-Type': 'tet/plain'});
  res.end('hello world');
});

http.createServer(app).listen(3000);