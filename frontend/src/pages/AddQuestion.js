import { useState } from "react";
import axios from "axios";

function AddQuestion() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleSubmit = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/questions/add",
        {
          title,
          description,
          difficulty,
          testCases: []
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      alert("Question added successfully");

    } catch (error) {

      console.error(error);
      alert("Error adding question");

    }

  };

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Add Question
      </h1>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-4"
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="border p-2 mb-4"
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Question
      </button>

    </div>

  );

}

export default AddQuestion;