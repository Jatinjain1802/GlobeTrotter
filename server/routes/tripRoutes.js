import express from 'express';
import { createTrip, getTrips, getTripDetails } from '../controllers/tripController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripDetails);

export default router;
