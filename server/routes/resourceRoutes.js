import express from 'express';
import { getCities, getActivities } from '../controllers/resourceController.js';

const router = express.Router();

router.get('/cities', getCities);
router.get('/activities', getActivities);

export default router;
