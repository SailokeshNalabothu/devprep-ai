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

    console.log("✅ Question Added:", question._id);

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (error) {

    console.error("❌ ADD ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ================= GET ALL QUESTIONS =================
exports.getQuestions = async (req, res) => {

  try {

    const questions = await Question.find();

    console.log("📦 Total Questions:", questions.length);

    res.json(questions);

  } catch (error) {

    console.error("❌ FETCH ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ================= DELETE QUESTION =================
exports.deleteQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    console.log("🗑 DELETE REQUEST ID:", id);

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {

      console.log("⚠️ Question not found");

      return res.status(404).json({
        message: "Question not found"
      });

    }

    console.log("✅ Question Deleted:", deletedQuestion._id);

    res.json({
      message: "Question deleted successfully",
      deletedQuestion
    });

  } catch (error) {

    console.error("❌ DELETE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
// ================= UPDATE QUESTION =================
exports.updateQuestion = async (req, res) => {

  try {

    const { id } = req.params;
    const { title, description, difficulty, testCases } = req.body;

    console.log("✏️ UPDATE REQUEST:", id);

    const updated = await Question.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        testCases
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    console.log("✅ Question Updated:", updated._id);

    res.json({
      message: "Question updated successfully",
      updated
    });

  } catch (error) {

    console.error("❌ UPDATE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};