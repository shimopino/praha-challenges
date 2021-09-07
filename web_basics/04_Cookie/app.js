const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

app.use("/public", express.static(path.resolve(__dirname, "public")));

app.get("/", (req, res) => {

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

  // "/public"にアクセスしたときだけ送信される
  res.cookie("path", "public", {
    path: "/public"
  })

  // localhostの場合に送信される
  res.cookie("domain", "same", {
    domain: "localhost"
  })

  res.json({
    message: "root access"
  });
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
})