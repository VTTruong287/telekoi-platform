import express from 'express';

const router = express.Router();

router.get('/test', (req, res, next) => res.send('OK'));

export default router;
