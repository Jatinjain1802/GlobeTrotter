import express from 'express';
import { getPublicTrip } from '../controllers/publicController.js';

const router = express.Router();

router.get('/trips/:id', getPublicTrip);

export default router;
