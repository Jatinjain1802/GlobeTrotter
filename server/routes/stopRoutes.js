import express from 'express';
import { addStop, addActivityToStop, getStopsByTripId } from '../controllers/stopController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/:tripId/create', addStop); // POST /stops/:tripId/create
router.post('/:stopId/activities', addActivityToStop); // POST /stops/:stopId/activities
router.get('/:tripId', getStopsByTripId); // GET /stops/:tripId
router.post('/:stopId/activities', addActivityToStop); // POST /stops/:stopId/activities

export default router;
