import Router, { Request, Response } from 'express';
import cors from 'cors';

const router = Router();

router.get('/set-cookie', (req: Request, res: Response) => {
  res.cookie('name', 'value', {
    maxAge: 1000 * 60,
  });
  res.header('Access-Control-Allow-Origin', '*');
  res.json({
    message: 'set cookie for experiment',
  });
});

const allOriginOptions = {
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204,
  credentials: true,
};

router.options('/origin-all', cors(allOriginOptions));
router.post(
  '/origin-all',
  cors(allOriginOptions),
  (req: Request, res: Response): void => {
    console.log(req.headers);
    res.json({
      message: `CORS Request for POST ${req.params.id}`,
    });
  },
);

const specifiedOriginOptions = {
  origin: 'http://localhost:8090',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204,
  credentials: true,
};

router.options('/origin-specified', cors(specifiedOriginOptions));
router.post(
  '/origin-specified',
  cors(specifiedOriginOptions),
  (req: Request, res: Response): void => {
    console.log(req.headers);
    res.json({
      message: `CORS Request for POST ${req.params.id}`,
    });
  },
);

export default router;
