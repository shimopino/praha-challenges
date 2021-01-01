const express = require('express');
const http = require('http');

const app = express();

app.get('/', (req, res) => {
  res.end('welcome to homepage');
})

app.get('/about', (req, res) => {
  res.end('welcome to the about page');
})

app.get('/weather', (req, res) => {
  res.end('the current weather is nice');
})

app.get('/hello/:who', (req, res) => {
  // 脆弱性あり
  res.end('hello, ' + req.params.who + '.');
})

app.use((req, res) => {
  res.statusCode = 404;
  res.end('404!');
})

http.createServer(app).listen(3000);