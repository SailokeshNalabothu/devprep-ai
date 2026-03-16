const Question = require("../models/Question");


// ================= ADD QUESTION =================
exports.addQuestion = async (req, res) => {

  try {

    const { title, description, difficulty, testCases } = req.body;

    const question = new Question({
      title,
      description,
      difficulty,
      testCases
    });

    await question.save();

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ================= GET ALL QUESTIONS =================
exports.getQuestions = async (req, res) => {

  try {

    const questions = await Question.find();

    res.json(questions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ================= DELETE QUESTION =================
exports.deleteQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    res.json({
      message: "Question deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};