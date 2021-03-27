import express from 'express';

/**
 * 各ルーティングに共通する処理を定義した抽象クラス
 * 具象クラスでは、対象のルーティングの名称設定とApplicationに対するHTTPメソッドを定義する
 */
export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;

  /**
   * 具象クラスから呼ばれるコンストラクタ<br>
   * 具象クラスは、それぞれの独自の名称を設定する必要がある
   * 以下のように登録すればHTTPメソッドの登録まで完了する
   * {@code routes.push(new UsersRoutes(app));}
   *
   * @param app  - HTTPメソッドを登録する対象となるアプリケーション
   * @param name - 特定のリソースに対するルーティングを設定した具象クラスの名称
   */
  constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  /**
   * 具象クラスで設定した名称を取得する
   */
  getName() {
    return this.name;
  }

  /**
   * 具体的なHTTPメソッドを設定するメソッド
   * 対象クラスのコンストラクタが呼び出されると同時に登録する
   *
   * https://expressjs.com/en/4x/api.html#app.route
   */
  abstract configureRoutes(): express.Application;
}
