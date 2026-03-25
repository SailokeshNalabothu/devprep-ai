const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const key = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(key);

// Helper to get-model with fallback logic
const getModel = (modelName = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Common models to try if the default one fails - Updated based on diagnostic
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-flash-latest', 'gemini-pro-latest'];

async function generateWithFallback(prompt, defaultModel = 'gemini-2.5-flash') {
  let lastError = null;
  
  // Try models in order
  const modelsToTry = [defaultModel, ...FALLBACK_MODELS.filter(m => m !== defaultModel)];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${modelName} (with 60s timeout)`);
      // Setting a generous timeout for potentially slow connections
      const model = genAI.getGenerativeModel({ model: modelName }, { timeout: 60000 });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // If it's a 404, we definitely want to try the next model
      if (error.message.includes('404') || error.message.includes('not found')) {
        continue;
      }
      // For other errors (like auth), we might want to stop early, but for now let's try all
      continue;
    }
  }
  
  throw lastError || new Error('All models failed to generate content');
}

exports.generateHints = async (question) => {
  try {
    const prompt = `Generate step-by-step hints for solving this coding problem:

Title: ${question.title}
Description: ${question.description}
Difficulty: ${question.difficulty}

Provide exactly 3 hints:
1. Idea: A high-level concept or approach
2. Approach: More detailed strategy
3. Pseudocode: Step-by-step pseudocode outline

Format as a numbered list.`;

    console.log('Calling Gemini API for hints...');
    const hintsText = await generateWithFallback(prompt);
    console.log('Gemini API response received for hints');
    
    // Parse the numbered list into array - more flexible parsing
    const hints = hintsText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && (line.match(/^\d+\./) || line.match(/^[*-]/) || line.match(/^Hint\s*\d+:/i)))
      .map(line => line.replace(/^(\d+\.|[*-]|Hint\s*\d+:)\s*/i, '').trim());

    return hints.length >= 3 ? hints.slice(0, 3) : ['Hint generation failed', 'Please try again', 'Contact support if issue persists'];
  } catch (error) {
    console.error('Error generating hints:', error.message);
    return ['Hint generation failed', 'Please try again', 'Contact support if issue persists'];
  }
};

exports.reviewCode = async (code, question, language) => {
  try {
    const prompt = `Review this ${language} code submission for the problem:

Problem: ${question.title}
Description: ${question.description}

Code:
${code}

Provide:
1. Mistakes or issues found
2. Suggestions for improvement (time/space optimization)
3. Overall feedback

Be constructive and helpful. Keep it concise.`;

    console.log('Calling Gemini API for code review...');
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Error reviewing code:', error.message);
    return 'Code review failed. Please try again.';
  }
};

exports.generateExplanation = async (code, question, language) => {
  try {
    const prompt = `Explain this ${language} solution to the problem in a human-readable way, like a teacher:

Problem: ${question.title}
Description: ${question.description}

Solution Code:
${code}

Provide a step-by-step explanation of how the code works, including:
- Overall approach
- Key logic and data structures
- Why it solves the problem

Make it educational and easy to understand. Keep it concise.`;

    console.log('Calling Gemini API for explanation...');
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Error generating explanation:', error.message);
    return 'Explanation generation failed. Please try again.';
  }
};

exports.analyzeComplexity = async (code, language) => {
  try {
    const prompt = `Analyze the time and space complexity of this ${language} code:

${code}

Provide:
- Time Complexity: O(?) with explanation
- Space Complexity: O(?) with explanation

Be precise and explain your reasoning. Keep it concise.`;

    console.log('Calling Gemini API for complexity analysis...');
    return await generateWithFallback(prompt);
  } catch (error) {
    console.error('Error analyzing complexity:', error.message);
    return 'Complexity analysis failed. Please try again.';
  }
};