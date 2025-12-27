import express from 'express';
import { createTopic, getTopics } from '../controllers/topicController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createTopic).get(protect, getTopics);

export default router;
