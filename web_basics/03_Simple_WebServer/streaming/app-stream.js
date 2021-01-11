require("dotenv").config();
const fs = require("fs");
const path = require("path");
const showMemoryUsage = require("./utils");

const fname = path.join(__dirname, process.env.TARGET);

// ファイズサイズの確認
console.log('File size:', fs.statSync(fname).size / 1024 / 1024, 'MB');

// ストリーム形式で読み込んだ場合
fs.createReadStream(fname, "binary")
  .on("data", (data) => {
    // 1チャンクのデータ量
    console.log("Read bytelength: ", Buffer.byteLength(data));

    showMemoryUsage();
  }).on("end", () => {
    console.log("end");

    showMemoryUsage();
  }).on("error", (err) => {
    console.log(err);
  })
