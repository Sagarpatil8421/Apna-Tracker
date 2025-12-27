import asyncHandler from 'express-async-handler';
import SubTopic from '../models/subTopicModel.js';
import Topic from '../models/topicModel.js';

// @desc    Create a new subtopic
// @route   POST /api/subtopics
// @access  Private
const createSubTopic = asyncHandler(async (req, res) => {
  const { name, topic, difficulty, leetcodeLink, youtubeLink, articleLink } = req.body;

  if (!name || !topic) {
    res.status(400);
    throw new Error('Name and topic are required');
  }

  if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    res.status(400);
    throw new Error('Invalid difficulty value');
  }

  const foundTopic = await Topic.findById(topic);

  if (!foundTopic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // ensure topic belongs to user
  if (foundTopic.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add subtopics to this topic');
  }

  const subtopic = await SubTopic.create({
    name,
    topic,
    user: req.user._id,
    difficulty: difficulty || undefined,
    leetcodeLink: leetcodeLink || undefined,
    youtubeLink: youtubeLink || undefined,
    articleLink: articleLink || undefined,
  });

  res.status(201).json(subtopic);
});

// @desc    Get all subtopics for a topic (user scoped)
// @route   GET /api/subtopics/:topicId
// @access  Private
const getSubTopicsByTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;

  const subtopics = await SubTopic.find({ topic: topicId, user: req.user._id });

  res.json(subtopics);
});

// @desc    Get all subtopics for logged-in user
// @route   GET /api/subtopics
// @access  Private
const getAllSubTopics = asyncHandler(async (req, res) => {
  const subtopics = await SubTopic.find({ user: req.user._id });

  res.json(subtopics);
});

// @desc    Update subtopic status
// @route   PUT /api/subtopics/:id
// @access  Private
const updateSubTopicStatus = asyncHandler(async (req, res) => {
  const subtopic = await SubTopic.findOne({ _id: req.params.id, user: req.user._id });

  if (!subtopic) {
    res.status(404);
    throw new Error('SubTopic not found');
  }

  const { status } = req.body;

  if (status) {
    if (!['Pending', 'Done'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    subtopic.status = status;
  }

  const updated = await subtopic.save();

  // After updating a subtopic's status, check all subtopics for the same topic.
  // If every subtopic is 'Done' (and there is at least one), mark the parent Topic as 'Done'.
  // Otherwise mark the parent Topic as 'Pending'. Ensure topic is owned by the same user.
  const parentTopic = await Topic.findById(subtopic.topic);

  if (parentTopic) {
    // Ensure the authenticated user owns the topic before modifying it
    if (parentTopic.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update parent topic status');
    }

    const subtopicsOfTopic = await SubTopic.find({ topic: parentTopic._id });

    const allDone = subtopicsOfTopic.length > 0 && subtopicsOfTopic.every((s) => s.status === 'Done');

    parentTopic.status = allDone ? 'Done' : 'Pending';
    await parentTopic.save();
  }

  res.json(updated);
});

export { createSubTopic, getSubTopicsByTopic, updateSubTopicStatus, getAllSubTopics };
