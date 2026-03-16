const Submission = require("../models/Submission");
const Question = require("../models/Question");
const { runCode } = require("../services/codeRunner");


// ================= RUN CODE ONLY =================
exports.runCodeOnly = async (req, res) => {

  try {

    const { code, language } = req.body;

    const languageMap = {
      javascript: 63,
      python: 71,
      c: 50,
      cpp: 54,
      java: 62
    };

    const languageId = languageMap[language] || 63;

    const result = await runCode(code, languageId);

    res.json({
      result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error executing code"
    });

  }

};



// ================= SUBMIT CODE WITH TEST CASE VALIDATION =================
exports.submitCode = async (req, res) => {

  try {

    const { questionId, code, language } = req.body;

    const languageMap = {
      javascript: 63,
      python: 71,
      c: 50,
      cpp: 54,
      java: 62
    };

    const languageId = languageMap[language] || 63;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    let finalStatus = "Accepted";
    let testResults = [];

    for (const testCase of question.testCases) {

      const wrappedCode = `
${code}

const result = twoSum(...JSON.parse("[${testCase.input}]"));
console.log(JSON.stringify(result));
`;

      const result = await runCode(wrappedCode, languageId);

      const output = result?.stdout?.trim();

      if (output === testCase.output.trim()) {

        testResults.push({
          input: testCase.input,
          expected: testCase.output,
          output: output,
          status: "Passed"
        });

      } else {

        testResults.push({
          input: testCase.input,
          expected: testCase.output,
          output: output,
          status: "Failed"
        });

        finalStatus = "Wrong Answer";

      }

    }

    const submission = new Submission({
      userId: req.user.id,
      questionId,
      code,
      language,
      status: finalStatus
    });

    await submission.save();

    res.json({
      status: finalStatus,
      testResults
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= GET USER SUBMISSIONS =================
exports.getUserSubmissions = async (req, res) => {

  try {

    const submissions = await Submission.find({
      userId: req.user.id
    });

    res.json(submissions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};