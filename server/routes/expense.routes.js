import express from 'express';
import { createExpense, getExpensesByTrip } from '../controllers/expense.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/:tripId", authMiddleware, getExpensesByTrip);

export default router;
