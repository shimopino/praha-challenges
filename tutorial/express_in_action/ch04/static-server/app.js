const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const PORT = 3000;

const app = express();

// https://github.com/expressjs/morgan
app.use(morgan("short"));

// http://evanhahn.com/express-dot-static-deep-dive/
const staticPath = path.join(__dirname, "static");
app.use(express.static(staticPath));
 

app.use((req, res) => {
  res.status(404);
  res.send("File Not Found");
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
});