# テンプレートエンジン

ビューエンジンとExpress

- 基本的にはどのビューエンジンを使うとしても、ビューエンジンがExpressに対応しているのであれば、Express側からは特に意識する必要はない
- Expressからは簡易的にビューとそのエンジンを使用することが可能である

  ```js
  // 拡張子(ejs)とビューエンジンを指定
  app.set("view engine", "ejs");
  // ejsファイルの格納場所を指定
  app.set("views", path.resolve(__dirname, "views"));

  app.get("/", (req, res) => {
    // viewsのindex(.ejs)ファイルをレンダリング
    res.render("index");
  }) 
  ```