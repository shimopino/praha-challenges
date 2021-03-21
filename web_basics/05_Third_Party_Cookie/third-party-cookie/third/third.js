const express = require("express");
const cookieParser = require("cookie-parser");
const {resolve, join} = require("path");

const appThird = express();

// リクエストに付与されているCookieを出力する
appThird.use(cookieParser());
appThird.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

// 画像の配信とCookieの設定
appThird.get("/img", (req, res) => {
  res.cookie("3pcookie", "sample", {
    // top-level navigationではないので、sameSiteとsecureが必要になる
    sameSite: "none",
    secure: true,
    httpOnly: true
  })
  res.sendFile(resolve(join(__dirname, "public", "mycat-tiny.jpg")));
});

appThird.get("/frame", (req, res) => {
  res.cookie("3p-1pcookie", "sample", {
    httpOnly: true
  })
  res.sendFile(resolve(join(__dirname, "public", "frame.html")));
});

module.exports = appThird;
