const express = require("express");
const cookieParser = require("cookie-parser");
const {resolve, join} = require("path");

const appFirst = express();
const appThird = express();

const FIRST_PORT = process.env.FIRST_PORT || 9080;
const THIRD_PORT = process.env.THIRD_PORT || 9090;

appFirst.get("/", express.static(resolve(join(__dirname, "public"))));

appThird.use(cookieParser());
appThird.get("/script", (req, res) => {
  res.cookie("3pcookie", "sample", {
    sameSite: "none",
    secure: true
  })
  res.sendFile(resolve(join(__dirname, "third-script", "script.js")));
})

appFirst.listen(FIRST_PORT, () => {
  console.log(`listening on port ${FIRST_PORT}`);
})
appThird.listen(THIRD_PORT, () => {
  console.log(`listening on port ${THIRD_PORT}`);
})
