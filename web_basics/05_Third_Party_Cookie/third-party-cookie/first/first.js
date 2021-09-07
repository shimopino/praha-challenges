const express = require("express");
const {resolve, join} = require("path");

const appFirst = express();

appFirst.use(express.static(resolve(join(__dirname, "public")), {
  setHeaders: (res, path, stat) => {
    res.cookie("1pcookie", "sample", {
      httpOnly: true
    })
  }
}));

module.exports = appFirst;

console.log(__dirname);
