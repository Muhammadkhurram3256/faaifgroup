import express from 'express';

const router = express.Router();

const VERSION = process.env.npm_package_version ?? '1.0.0';

router.get('/', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true, version: VERSION });
});

export default router;
