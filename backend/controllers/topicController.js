import asyncHandler from 'express-async-handler';
import Topic from '../models/topicModel.js';

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private
const createTopic = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }

  const topic = await Topic.create({
    name,
    user: req.user._id,
  });

  res.status(201).json(topic);
});

// @desc    Get all topics for logged-in user
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({ user: req.user._id });

  res.json(topics);
});

export { createTopic, getTopics };
