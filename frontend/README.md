# DevPrep AI - Smart Coding Interview Preparation Platform

DevPrep AI is an advanced coding interview preparation platform that combines automated code execution with AI-powered guidance to help developers excel in technical interviews.

## Features

### Core Functionality
- **User Authentication**: Secure signup/login with JWT tokens
- **Question Bank**: Browse coding problems by difficulty (Easy/Medium/Hard)
- **Integrated Code Editor**: Monaco Editor with syntax highlighting
- **Code Execution**: Real-time code testing using Judge0 API
- **Automated Testing**: Validate solutions against predefined test cases
- **Progress Tracking**: View submission history and statistics
- **Leaderboard**: Compete with other users based on solved problems

### AI-Powered Features (New!)
- **AI Code Review**: Get detailed feedback on submitted solutions, including mistakes and optimization suggestions
- **Step-by-Step Hints**: AI-generated hints to guide you through problem-solving (Idea → Approach → Pseudocode)
- **Solution Explanation**: Human-readable explanations of accepted solutions, like a teacher
- **Complexity Analysis**: Automatic time and space complexity analysis of your code

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for data storage
- **JWT** for authentication
- **Google Gemini API** for AI features (free tier available)
- **Judge0 API** for code execution

### Frontend
- **React** with **React Router**
- **Monaco Editor** for code editing
- **Tailwind CSS** for styling
- **Axios** for API communication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devprep-ai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Add your Google Gemini API key to .env
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   npm start
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Add new question (admin only)

### Submissions
- `POST /api/submissions/run` - Run code without validation
- `POST /api/submissions/submit` - Submit code with test validation
- `GET /api/submissions/my-submissions` - Get user's submissions
- `GET /api/submissions/hints/:questionId` - Get AI hints for a question
- `POST /api/submissions/explanation` - Generate solution explanation
- `POST /api/submissions/complexity` - Analyze code complexity

### Leaderboard
- `GET /api/leaderboard` - Get user rankings

## Usage

1. **Sign up/Login** to create your account
2. **Browse Questions** on the dashboard
3. **Solve Problems** in the integrated editor
4. **Get AI Hints** if you're stuck
5. **Run Code** to test your solution
6. **Submit Code** to validate against test cases
7. **Review AI Feedback** for accepted solutions
8. **Track Progress** on your profile and leaderboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.