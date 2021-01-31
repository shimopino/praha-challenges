import express, { Request, Response } from 'express';
import path from 'path';
import loggingHandler from './middleware/logging';

/**
 * https://expressjs.com/en/api.html#res.sendFile
 *
 * res.sendFile(path [, options] [, fn])
 *
 * ファイルの拡張子をもとにContent-Typeを設定する
 * なおルートディレクトリを設定しない限り、絶対パスを設定する必要がある
 *
 * optionsには以下が設定可能
 * - maxAge:
 *   Cache-Controlのヘッダとして、有効期限をミリ秒で指定する
 *   デフォルトでは0秒
 * - root:
 *   相対パスを設定するためのルートディレクトリ
 * - lastModified:
 *   Last-Modifieのヘッダとして、OS上のファイルの最終変更日時を設定する
 * - headers:
 *   ファイルを提供する際にHTTPヘッダをオブジェクトで指定する
 * - dotfiles:
 *   dotfilesを送信するのか設定する
 *   "ignore", "allow", "deny"
 * - cacheControl:
 *   レスポンスヘッダにCache-Controlを設定できるかどうか決定する
 * -
 *
 */

const app = express();
const PORT = process.env.PORT || 8080;

app.use(loggingHandler('short'));

app.get('/', (req: Request, res: Response): void => {
  res.json({
    message: 'Welcome !!',
  });
});

app.get('/home', (req: Request, res: Response): void => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '../public'),
  });
});

app.get('/cached', (req: Request, res: Response): void => {
  const cachedOptions = {
    root: path.join(__dirname, '../public'),
    headers: {
      sentTime: Date.now(),
    },
  };
  // Cache-Control: 1 minute
  res.set('Cache-Control', 'public, max=age=0');
  res.sendFile('cached.jpg', cachedOptions);
});

app.get('/no-cached', (req: Request, res: Response): void => {
  const cachedOptions = {
    root: path.join(__dirname, '../public'),
    headers: {
      sentTime: Date.now(),
    },
  };
  // Cache-Control: 1 minute
  res.set('Cache-Control', 'no-store');
  res.sendFile('no-cached.jpg', cachedOptions);
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
