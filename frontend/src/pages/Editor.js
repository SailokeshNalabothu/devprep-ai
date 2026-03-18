import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

function CodeEditor() {

  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [output, setOutput] = useState("");


  useEffect(() => {

    const fetchQuestion = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/questions"
        );

        const q = res.data.find((item) => item._id === id);

        setQuestion(q);

      } catch (error) {

        console.error(error);

      }

    };

    fetchQuestion();

  }, [id]);


  // ================= RUN CODE =================
  const runCode = async () => {

    try {

      setOutput("Running...");

      const res = await axios.post(
        "http://localhost:5000/api/submissions/run",
        {
          code: code,
          language: "javascript"
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      const result = res.data.result;

      setOutput(
        result.stdout ||
        result.stderr ||
        result.compile_output ||
        result.message ||
        result.status.description
      );

    } catch (error) {

      console.error(error);

      setOutput("Error running code");

    }

  };


  // ================= SUBMIT CODE =================
  const submitCode = async () => {

    try {

      setOutput("Evaluating...");

      const res = await axios.post(
        "http://localhost:5000/api/submissions/submit",
        {
          questionId: id,
          code: code,
          language: "javascript"
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      const result = res.data;

      let display = `Final Result: ${result.status}\n\n`;

      result.testResults.forEach((tc, index) => {

        display += `Test Case ${index + 1}: ${tc.status}\n`;

      });

      setOutput(display);

    } catch (error) {

      console.error(error);

      setOutput("Error submitting code");

    }

  };


  if (!question) return <div>Loading...</div>;


  return (

    <div className="h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 bg-white p-6 overflow-auto">

        <h1 className="text-2xl font-bold mb-4">
          {question.title}
        </h1>

        <span className={`px-3 py-1 rounded text-sm ${
          question.difficulty === "Easy"
            ? "bg-green-100 text-green-700"
            : question.difficulty === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}>
          {question.difficulty}
        </span>

        <p className="mt-6 text-gray-700">
          {question.description}
        </p>


        {/* TEST CASES */}
        <div className="mt-8">

          <h2 className="text-lg font-bold mb-3">
            Example Test Cases
          </h2>

          {question.testCases.map((tc, index) => (

            <div key={index} className="bg-gray-100 p-4 rounded mb-3">

              <p className="text-sm font-semibold">
                Input
              </p>

              <pre>{tc.input}</pre>

              <p className="text-sm font-semibold">
                Expected Output
              </p>

              <pre>{tc.output}</pre>

            </div>

          ))}

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="w-1/2 flex flex-col">

        <div className="flex justify-between items-center p-4 bg-gray-900 text-white">

          <h2>Code Editor</h2>

          <div className="space-x-3">

            <button
              onClick={runCode}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Run Code
            </button>

            <button
              onClick={submitCode}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Submit
            </button>

          </div>

        </div>

        <Editor
          height="60vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />

        <div className="p-4 bg-gray-100">

          <h3 className="font-bold mb-2">
            Output
          </h3>

          <pre className="bg-white p-4 rounded shadow">
            {output}
          </pre>

        </div>

      </div>

    </div>

  );

}

export default CodeEditor;