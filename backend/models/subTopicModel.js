import mongoose from 'mongoose';

const subTopicSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Done'],
      default: 'Pending',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Topic',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    leetcodeLink: {
      type: String,
      default: null,
    },
    youtubeLink: {
      type: String,
      default: null,
    },
    articleLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SubTopic = mongoose.model('SubTopic', subTopicSchema);

export default SubTopic;
