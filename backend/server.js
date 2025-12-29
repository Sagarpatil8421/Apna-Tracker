import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import subTopicRoutes from './routes/subTopicRoutes.js';
import topicRoutes from './routes/topicRoutes.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS configuration for cross-domain cookie authentication
// In production: allow specific frontend domains
// In development: allow localhost on any port
const corsOptions = {
  // Allow requests from frontend domains
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://apna-tracker.vercel.app',
      'https://apna-tracker.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173',
    ];
    
    // Allow requests with no origin (mobile apps, curl requests, same-origin requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Allow cookies to be sent and received with requests
  credentials: true,
  // Allow specified HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Allow specified headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Allow credentials in requests
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/subtopics', subTopicRoutes);
app.use('/api/topics', topicRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
