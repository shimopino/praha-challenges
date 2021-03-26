import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const uploads = Object.create(null);

export const onUpload = (req: Request, res: Response): void => {
  const fileId = req.get('x-file-id');
  const startByte = req.get('x-start-byte');

  if (fileId === undefined) {
    res.writeHead(400, 'No file id');
    res.end();
  } else {
    // 型ガードを行った上で else ブロックを使用しない方法がわからない...
    const filePath = path.join('tmp', fileId);

    // 対象のファイルを受信していない場合は初期化する
    if (!uploads[fileId]) {
      uploads[fileId] = {};
    }
    const upload = uploads[fileId];

    let fileStream;

    if (startByte) {
      // 受け取った開始バイト位置が0の場合は、ファイルを新規作成
      upload.bytesReceived = 0;
      fileStream = fs.createWriteStream(filePath, {
        flags: 'w',
      });
    } else {
      // ファイルのアップロードを再開する場合
      if (upload.bytesReceived != startByte) {
        // サーバ側のバイト数とクライアントが送信するバイト数が違う場合
        res.writeHead(400, 'Wrong start byte: ' + upload.bytesReceived);
        res.end();
        return;
      }

      fileStream = fs.createWriteStream(filePath, {
        flags: 'a',
      });
    }

    // リクエストボディのContent-Lengthを足し上げる
    res.on('data', (data) => {
      upload.bytesReceived += data.length;
    });

    // リクエストボディの内容をファイルに書き込む
    req.pipe(fileStream);

    // サーバが全てのリクエストを受信した際の処理
    fileStream.on('close', () => {
      if (upload.bytesReceived == req.get('x-file-size')) {
        // ファイルを全て受信した場合
        delete uploads[fileId];
        res.end('success: ' + upload.bytesReceived);
      } else {
        // 一部のデータを受け取ることができていない場合
        res.end('File unfinished, stopped at ' + upload.bytesReceived);
      }
    });

    // ファイルI/Oでエラーが生じた際の処理
    fileStream.on('error', (err) => {
      res.writeHead(500, 'file error: ' + err.message);
      res.end();
    });
  }
};

export const onStatus = (req: Request, res: Response): void => {
  const fileId = req.get('x-file-id');

  if (fileId === undefined) {
    res.writeHead(400, 'missing fileId');
    res.end();
  } else {
    // else ブロックを使わない型ガードとは...
    // let を使えば else ブロックを最小化できそうだが...
    const upload = uploads[fileId];

    if (!upload) {
      res.end('0');
    } else {
      res.end(String(upload.bytesReceived));
    }
  }
};
