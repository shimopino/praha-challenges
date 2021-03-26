import express, { Request, Response } from 'express';

const PORT = process.env.PORT || 8080;
const sameOriginApp = express();

sameOriginApp.use('/public', express.static('public'));

sameOriginApp.use(express.json());
sameOriginApp.use(express.urlencoded({ extended: true }));
sameOriginApp.post('/no-cors', (req: Request, res: Response): void => {
  console.log(req.headers);
  console.log(req.body);
  res.json({
    message: `POST for no-cors by username: ${
      (req.body as { username: string }).username
    }`,
  });
});
sameOriginApp.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});

const PORT_OTHER = process.env.PORT_OTHER || 8090;
const otherOriginApp = express();

otherOriginApp.use('/public', express.static('public'));
otherOriginApp.listen(PORT_OTHER, () => {
  console.log(`listening on http://localhost:${PORT_OTHER}`);
});
