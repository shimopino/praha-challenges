import path from "path";

module.exports = {
  // process.env.NODE_ENVに"development"を設定する
  mode: "development",

  // エントリポイントのファイルを設定する
  entry: {
    bundle: "./src/index.tsx",
  },

  // バンドルしたファイルの出力先を決定する
  output: {
    // 出力先フォルダ名
    path: path.resolve(__dirname, "dist"),
    // 出力先ファイル名
    filename: "bundled.js",
  },

  // デフォルトではwebpackはJSかJSONしか読み込めない
  // TypeScriptなども読み込めるようにする
  module: {
    rules: [
      {
        // TypeScriptの拡張子の場合
        test: /\.tsx?$/,
        // TypeScriptを以下でコンパイル
        use: "ts-loader",
        // 以下のフォルダは除外
        exclude: /node_modules/,
      },
    ],
  },

  // import File from '../path/to/file';した際にTypeScriptを読み込む
  // これで読み込む際に拡張子を指定する必要がなくなる
  resolve: {
    extensions: [".ts", ".tsx", ".js", "json"],
  },

  // webpack-dev-server用の設定
  devServer: {
    // 開発サーバを起動する起点を設定する
    contentBase: path.resolve(__dirname, "public"),
    // gzip圧縮を使用する
    compress: true,
    // リクエストを受け付けるポート番号を指定する
    port: 3000,
  },
};
