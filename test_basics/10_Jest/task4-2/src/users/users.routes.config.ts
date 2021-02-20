import { CommonRoutesConfig } from '../common/common.routes.config';
import UsersController from './controllers/users.controller';
import UsersMiddleware from './middleware/users.middleware';
import express from 'express';

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes');
  }

  /**
   * 下記の参照先のように同URLが設定されている IRoute オブジェクトに対して
   * 複数行を使用してHTTPメソッドを指定することができる
   *
   * https://expressjs.com/en/4x/api.html#app.route
   */
  configureRoutes() {
    /**
     * router.getやrouter.postの引数には (...handlers: RequestHandler) のように
     * ハンドラとなる関数を複数設定することが可能である
     *
     * https://expressjs.com/en/4x/api.html#router.METHOD
     */
    this.app
      .route(`/users`)
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser,
      );

    /**
     * router.paramを使用してURLに含まれているパラメータを取得するための
     * コールバック関数を指定することができる
     *
     * https://expressjs.com/en/4x/api.html#router.param
     */
    this.app.param(`userId`, UsersMiddleware.extractUserId);
    this.app
      .route(`/users/:userId`)
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put(`/users/:userId`, [
      UsersMiddleware.validateRequiredUserBodyFields,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put,
    ]);

    this.app.patch(`/users/:userId`, [
      UsersMiddleware.validatePatchEmail,
      UsersController.patch,
    ]);

    return this.app;
  }
}
