const Submission = require("../models/Submission");
const Question = require("../models/Question");

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const submissions = await Submission.find({
      userId: userId
    });

    const accepted = submissions.filter(
      s => s.status === "Accepted"
    );

    const solvedSet = new Set(
      accepted.map(s => s.questionId.toString())
    );

    let easy = 0;
    let medium = 0;
    let hard = 0;

    for (const qid of solvedSet) {

      const question = await Question.findById(qid);

      if (question.difficulty === "Easy") easy++;
      else if (question.difficulty === "Medium") medium++;
      else if (question.difficulty === "Hard") hard++;

    }

    const successRate =
      submissions.length === 0
        ? 0
        : ((accepted.length / submissions.length) * 100).toFixed(2);

    res.json({

      totalSubmissions: submissions.length,

      solvedProblems: solvedSet.size,

      successRate: successRate,

      difficultyStats: {
        easy,
        medium,
        hard
      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};