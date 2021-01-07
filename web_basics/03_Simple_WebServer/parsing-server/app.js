const express = require("express");
const http = require("http");

const PORT = 8080;
const app = express();

// "express.json"は"bodyParser.json"を結局参照している
app.use(express.json())

app.get("/", (req, res) => {

  res.status(200).json({
    text: "hello world"
  })
});

app.post("/", (req, res) => {
  
  if (req.is("application/json")) {
    const name = req.body.name;
    res.status(201).json({name});
  } else {
    res.status(400).json({error: "400! Bad Request"});
  }
});

http.createServer(app).listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
});
