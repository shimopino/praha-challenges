const http = require('http');

// const requestHandler = (req, res) => {
//   console.log('In comes a request to: ' + req.url);
//   res.end('Hello world');
// }

const requestHandler = (req, res) => {
  if (req.url === '/') {
    res.end('welcome to the homepage!');
  } else if (req.url === '/about') {
    res.end('welcome to the about page!');
  } else {
    res.end('Error! file not found');
  }
}

const server = http.createServer(requestHandler);

server.listen(3000);