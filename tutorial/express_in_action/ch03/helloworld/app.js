const express = require('express');
const http = require('http');
const logger = require('morgan');

const app = express();

// // ロギング用のミドルウェア
// app.use((req, res, next) => {
//   console.log('In comes a request to: ' + req.url);
//   next();
// });

// サードパーティ製ロギング用のミドルウェア
app.use(logger('short'));

// 認証用のミドルウェア
app.use((req, res, next) => {
  const minute = (new Date()).getMinutes();
  if ((minute % 2) === 0) {
    next();
  } else {
    res.status = 403;
    res.end('Not Authorized');
  }
});

// リクエスト処理用のミドルウェア
app.use((req, res) => {
  res.writeHead(200, {'Content-Type': 'tet/plain'});
  res.end('hello world');
});

http.createServer(app).listen(3000);