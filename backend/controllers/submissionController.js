const Submission = require("../models/Submission");
const Question = require("../models/Question");
const { runCode } = require("../services/codeRunner");
const { reviewCode, generateExplanation, analyzeComplexity } = require("../services/aiService");


// ================= STRIP TYPESCRIPT SYNTAX =================
function stripTypeScriptSyntax(code) {
  // Remove type annotations from variable declarations
  code = code.replace(/const\s+(\w+):\s*[^=]+=\s*/g, 'const $1 = ');
  code = code.replace(/let\s+(\w+):\s*[^=]+=\s*/g, 'let $1 = ');
  code = code.replace(/var\s+(\w+):\s*[^=]+=\s*/g, 'var $1 = ');
  
  // Remove type annotations from function parameters
  code = code.replace(/(\w+):\s*[^,)=]+([,)=])/g, '$1$2');
  
  // Remove interface and type declarations
  code = code.replace(/^(interface|type)\s+.*$/gm, '');
  
  // Remove generic type parameters
  code = code.replace(/<[^>]+>/g, '');
  
  return code;
}


// ================= WRAP CODE BY LANGUAGE =================
function wrapCode(code, language, functionName, input) {
  switch (language) {
    case 'javascript':
      return `
${code}
const result = ${functionName}(...JSON.parse("[${input}]"));
console.log(JSON.stringify(result));
`;
    case 'python':
      // Basic python wrapper - assumes comma separated input in ${input} matches function args
      return `
import json
${code}
try:
    result = ${functionName}(${input})
    print(json.dumps(result))
except Exception as e:
    import sys
    print(str(e), file=sys.stderr)
`;
    case 'cpp':
      // For C++, if the user doesn't provide a main, we could provide one.
      // But for robustness, we'll let the user provide main or use our template.
      return code; 
    case 'java':
      // Ensure Java has a Main class and basic wrapper
      if (!code.includes('public class Main')) {
        return `
import java.util.*;
public class Main {
    ${code}
    public static void main(String[] args) {
        // Solution is usually instantiated here
    }
}
`;
      }
      return code;
    default:
      return code;
  }
}


// ================= RUN CODE ONLY =================
exports.runCodeOnly = async (req, res) => {

  try {

    const { code, language, customInput } = req.body;
    console.log(`runCodeOnly: language=${language}, codeLength=${code?.length}, hasCustomInput=${!!customInput}`);

    // JavaScript specific cleanup
    const cleanCode = (language === 'javascript' || !language) ? stripTypeScriptSyntax(code) : code;

    const languageMap = {
      javascript: 63,
      python: 71,
      c: 50,
      cpp: 54,
      java: 62
    };

    const languageId = languageMap[language] || 63;

    // Pass customInput as stdin to Judge0
    const result = await runCode(cleanCode, languageId, customInput);

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

    // JavaScript specific cleanup
    const cleanCode = (language === 'javascript' || !language) ? stripTypeScriptSyntax(code) : code;

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

      const wrappedCode = wrapCode(cleanCode, language, question.functionName, testCase.input);
      console.log(`Executing wrappedCode for ${language}:\n`, wrappedCode);

      // Pass testCase.input as stdin for languages that need it (C, C++, Java)
      const result = await runCode(wrappedCode, languageId, testCase.input);
      console.log(`Judge0 result for ${language}:`, result);

      // Capture all potential output/error streams
      const output = (result?.stdout || "").trim() || (result?.stderr || "").trim() || (result?.compile_output || "").trim() || "";
      const expected = testCase.output.trim();

      // Normalize both for comparison (remove whitespace to handle [0, 1] vs [0,1])
      if (output.replace(/\s+/g, "") === expected.replace(/\s+/g, "")) {

        testResults.push({
          input: testCase.input,
          expected: expected,
          output: output,
          status: "Passed"
        });

      } else {

        testResults.push({
          input: testCase.input,
          expected: expected,
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

    let review = null;
    let explanation = null;
    let complexity = null;

    if (finalStatus === "Accepted") {
      // Generate AI review, explanation, and complexity analysis in parallel for better performance
      console.log('Generating AI feedback in parallel...');
      try {
        const [reviewRes, explanationRes, complexityRes] = await Promise.all([
          reviewCode(code, question, language),
          generateExplanation(code, question, language),
          analyzeComplexity(code, language)
        ]);
        review = reviewRes;
        explanation = explanationRes;
        complexity = complexityRes;
      } catch (aiError) {
        console.error('Error in parallel AI generation:', aiError.message);
        review = "AI feedback temporarily unavailable.";
      }
    }

    res.json({
      status: finalStatus,
      testResults,
      review,
      explanation,
      complexity
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
    })
    .populate('questionId', 'title')
    .sort({ createdAt: -1 });

    res.json(submissions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// ================= GENERATE HINTS FOR QUESTION =================
exports.generateHints = async (req, res) => {

  try {

    const { questionId } = req.params;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    const hints = await require("../services/aiService").generateHints(question);

    res.json({
      hints
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error generating hints"
    });

  }

};



// ================= GENERATE EXPLANATION FOR CODE =================
exports.generateExplanation = async (req, res) => {

  try {

    const { code, questionId, language } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    const explanation = await generateExplanation(code, question, language);

    res.json({
      explanation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error generating explanation"
    });

  }

};



// ================= ANALYZE COMPLEXITY =================
exports.analyzeComplexity = async (req, res) => {

  try {

    const { code, language } = req.body;

    const complexity = await analyzeComplexity(code, language);

    res.json({
      complexity
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error analyzing complexity"
    });

  }

};

// ================= GET SOLVED QUESTIONS (UNIQUE) =================
exports.getSolvedQuestions = async (req, res) => {
  try {
    const solved = await Submission.distinct("questionId", {
      userId: req.user.id,
      status: "Accepted"
    });
    res.json(solved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};