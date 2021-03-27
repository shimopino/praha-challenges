import Router, { Request, Response } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({
    message: 'allow !!',
  });
});

export default router;
