const Submission = require("../models/Submission");
const Question = require("../models/Question");
const { generateWithFallback } = require("./aiService");

exports.analyzeUserPerformance = async (userId) => {
  try {
    // 1. Fetch all submissions for the user
    const submissions = await Submission.find({ userId }).populate("questionId");
    
    if (submissions.length === 0) {
      return {
        summary: "You haven't made any submissions yet. Start practicing to get personalized AI coaching!",
        recommendations: ["Solve your first problem!"]
      };
    }

    // 2. Prepare data for AI analysis
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted').length;
    const topics = {};
    const difficulties = { Easy: 0, Medium: 0, Hard: 0 };

    submissions.forEach(s => {
      if (s.questionId) {
        const diff = s.questionId.difficulty;
        difficulties[diff] = (difficulties[diff] || 0) + 1;
        
        // Basic topic extraction from title (since we don't have explicit topics in schema yet)
        const title = s.questionId.title.toLowerCase();
        let topic = "General";
        if (title.includes("sum") || title.includes("array") || title.includes("list")) topic = "Arrays & Hashing";
        if (title.includes("string") || title.includes("palindrome")) topic = "Strings";
        if (title.includes("tree")) topic = "Trees";
        
        topics[topic] = (topics[topic] || 0) + 1;
      }
    });

    // 3. Construct prompt for Gemini
    const prompt = `Act as a senior software engineering coach. Analyze this student's coding performance:
    - Total Submissions: ${totalSubmissions}
    - Problems Solved (Accepted): ${acceptedSubmissions}
    - Difficulty Breakdown: Easy (${difficulties.Easy}), Medium (${difficulties.Medium}), Hard (${difficulties.Hard})
    - Topic Focus: ${JSON.stringify(topics)}

    Provide:
    1. A professional summary of their current level (2-3 sentences).
    2. Specific technical weaknesses to work on.
    3. A 3-step personalized roadmap for the next week.
    
    Keep it encouraging but critically honest. Format in markdown.`;

    console.log(`Generating AI Coach analysis for user ${userId}...`);
     const analysis = await generateWithFallback(prompt);
     
    return {
      analysis,
      stats: {
        totalSubmissions,
        acceptedSubmissions,
        difficulties,
        topics
      }
    };

  } catch (error) {
    console.error("Error in AI Coach analysis:", error);
    throw error;
  }
};
