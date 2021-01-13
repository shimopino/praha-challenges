<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Table of Contents</summary>

- [テンプレートエンジン](#%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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