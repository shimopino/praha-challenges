const express = require('express');
const http = require('http');

const app = express();

// リクエスト処理用のミドルウェア
app.use((req, res) => {
  res.writeHead(200, {'Content-Type': 'tet/plain'});
  res.end('hello world');
});

http.createServer(app).listen(3000);