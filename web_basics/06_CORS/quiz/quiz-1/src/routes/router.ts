import Router, { Request, Response } from 'express';
import cors from 'cors';

const router = Router();

const corsOptions = {
  // TODO: HERE
};

router.options('/users/:id', cors(corsOptions));
router.post(
  '/users/:id',
  cors(corsOptions),
  (req: Request, res: Response): void => {
    console.log(`POST /users/${req.params.id}`);
    res.json({
      message: `CORS Request for POST ${req.params.id}`,
    });
  },
);

router.put(
  '/users/:id',
  cors(corsOptions),
  (req: Request, res: Response): void => {
    console.log(`PUT /users/${req.params.id}`);
    res.json({
      message: `CORS Request for PUT ${req.params.id}`,
    });
  },
);

export default router;
