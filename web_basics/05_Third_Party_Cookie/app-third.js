const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const appThird = express();

appThird.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
})

appThird.use(cookieParser());
appThird.use((req, res, next) => {
  console.log(req.cookies);
  next();
})

appThird.use((req, res, next) => {
  // 20秒後に送信されない
  res.cookie("max-age", "20sec", {
    maxAge: 1000 * 20
  })

  // 1分後に送信されない
  const d = new Date();
  d.setMinutes(d.getMinutes() + 1);
  res.cookie("expires", "in 1 minute", {
    expires: d
  })

  // 同じサイトなのでリクエストで送信される
  res.cookie("same-site1", "strict", {
    sameSite: "strict"
  })

  // 同じサイトなのでリクエストで送信される
  res.cookie("same-site2", "lax", {
    sameSite: "lax"
  })

  // "none"は必ずSecureと一緒に設定する必要がある
  // 今回は"none"でHTTP通信なのでリクエストで送信されない
  res.cookie("same-site3", "none", {
    sameSite: "none"
  })

  // "none"は必ずSecureと一緒に設定する必要がある
  // 今回は"none"でHTTP通信なのでリクエストで送信されない
  res.cookie("same-site3", "none", {
    sameSite: "none",
    secure: true
  })

  // document.cookieで表示されない
  res.cookie("httpnly", "true", {
    httpOnly: true
  })

  // http通信なのでリクエストで送信されない
  res.cookie("secure1", "true", {
    secure: true
  })

  // http通信なのでリクエストで送信される
  res.cookie("secure2", "false", {
    secure: false
  })
  
  next();
})

appThird.use(express.static(path.resolve(__dirname, "third-ads")));

module.exports = appThird;
