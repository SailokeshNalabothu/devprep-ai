import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditQuestion() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {

    const fetchQuestion = async () => {

      const res = await axios.get(
        "http://localhost:5000/api/questions"
      );

      const q = res.data.find(item => item._id === id);

      if (q) {
        setTitle(q.title);
        setDescription(q.description);
        setDifficulty(q.difficulty);
        setTestCases(q.testCases || []);
      }

    };

    fetchQuestion();

  }, [id]);


// ================= ADD TEST CASE =================
  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { input: "", output: "" }
    ]);
  };


// ================= UPDATE TEST CASE =================
  const updateTestCase = (index, field, value) => {

    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);

  };


// ================= DELETE TEST CASE =================
  const deleteTestCase = (index) => {

    const updated = testCases.filter((_, i) => i !== index);
    setTestCases(updated);

  };


// ================= SUBMIT =================
  const handleUpdate = async () => {

    try {

      await axios.put(
        `http://localhost:5000/api/questions/${id}`,
        {
          title,
          description,
          difficulty,
          testCases
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      alert("Question updated successfully");

      navigate("/questions");

    } catch (error) {

      console.error(error);
      alert("Update failed");

    }

  };


  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Edit Question
      </h1>

      {/* TITLE */}
      <input
        className="border p-2 w-full mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        className="border p-2 w-full mb-4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* DIFFICULTY */}
      <select
        className="border p-2 mb-6"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>


      {/* TEST CASES */}
      <h2 className="text-lg font-bold mb-3">
        Test Cases
      </h2>

      {testCases.map((tc, index) => (

        <div key={index} className="mb-4 bg-gray-100 p-4 rounded">

          <input
            placeholder="Input"
            className="border p-2 w-full mb-2"
            value={tc.input}
            onChange={(e) =>
              updateTestCase(index, "input", e.target.value)
            }
          />

          <input
            placeholder="Output"
            className="border p-2 w-full mb-2"
            value={tc.output}
            onChange={(e) =>
              updateTestCase(index, "output", e.target.value)
            }
          />

          <button
            onClick={() => deleteTestCase(index)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>

      ))}

      <button
        onClick={addTestCase}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        ➕ Add Test Case
      </button>


      {/* SUBMIT */}
      <div>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Update Question
        </button>
      </div>

    </div>

  );

}

export default EditQuestion;