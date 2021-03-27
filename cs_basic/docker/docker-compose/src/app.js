const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.json({
    message: "root access"
  });
});

app.listen(8080, () => {
  console.log(`listening on PORT: ${8080}`);
});