import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import stopRoutes from './routes/stopRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import expenseRoutes from './routes/expense.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/trips', tripRoutes);
app.use('/stops', stopRoutes);
app.use('/expenses', expenseRoutes); // Added expenses route
app.use('/resources', resourceRoutes);
app.use('/public', publicRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('GlobeTrotter API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
