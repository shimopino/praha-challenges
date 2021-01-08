const express = require("express");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express();

// "express.json"は"bodyParser.json"を結局参照している
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.resolve(__dirname, "public")));

app.get("/", (req, res) => {
  console.log(req.headers);
  console.log(req.body);

  res.status(200).json({
    text: "hello world",
  });
});

app.post("/", (req, res) => {
  console.log(req.headers);
  console.log(req.body);

  if (req.is("application/json")) {
    const name = req.body.name;
    res.status(201).json({ name });
  } else {
    res.status(400).json({ error: "400! Bad Request" });
  }
});

http.createServer(app).listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
