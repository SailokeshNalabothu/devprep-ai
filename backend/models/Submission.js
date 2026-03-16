const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },

  code: {
    type: String,
    required: true
  },

  language: {
    type: String,
    default: "javascript"
  },

  status: {
    type: String,
    default: "submitted"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Submission", submissionSchema);