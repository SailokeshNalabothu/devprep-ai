const { generateHints, reviewCode, generateExplanation, analyzeComplexity } = require('./backend/services/aiService');
require('dotenv').config({ path: './backend/.env' });

async function runTest() {
  const dummyQuestion = {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy'
  };

  const dummyCode = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
  `;

  console.log('--- Testing Hints ---');
  const hints = await generateHints(dummyQuestion);
  console.log('Hints:', hints);

  console.log('\n--- Testing Code Review ---');
  const review = await reviewCode(dummyCode, dummyQuestion, 'javascript');
  console.log('Review:', review);

  console.log('\n--- Testing Explanation ---');
  const explanation = await generateExplanation(dummyCode, dummyQuestion, 'javascript');
  console.log('Explanation:', explanation);

  console.log('\n--- Testing Complexity Analysis ---');
  const complexity = await analyzeComplexity(dummyCode, 'javascript');
  console.log('Complexity:', complexity);
}

runTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
