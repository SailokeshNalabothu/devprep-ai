const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },

  // NEW FIELD → Test Cases
  testCases: [
    {
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Question", questionSchema);