import express from 'express';
import {
  createSubTopic,
  getSubTopicsByTopic,
  updateSubTopicStatus,
  getAllSubTopics,
} from '../controllers/subTopicController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createSubTopic).get(protect, getAllSubTopics);
router.get('/:topicId', protect, getSubTopicsByTopic);
router.put('/:id', protect, updateSubTopicStatus);

export default router;
