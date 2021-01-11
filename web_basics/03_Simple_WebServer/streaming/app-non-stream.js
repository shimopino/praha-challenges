require("dotenv").config();
const fs = require("fs");
const path = require("path");
const showMemoryUsage = require("./utils");

const fname = path.join(__dirname, process.env.TARGET);

// ファイズサイズの確認
console.log('File size:', fs.statSync(fname).size / 1024 / 1024, 'MB');

// ストリームを使用せずにバッファメモリにすべて載せる場合
fs.readFile(fname, "utf8", (err, data) => {
  showMemoryUsage();
});
