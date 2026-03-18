import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Questions() {

  const [questions, setQuestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchQuestions = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/questions"
        );

        setQuestions(res.data);

      } catch (error) {

        console.error("Error fetching questions");

      }

    };

    fetchQuestions();

    // ✅ Check if admin
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsAdmin(payload.role === "admin");
    }

  }, []);


// ================= DELETE FUNCTION =================
  const deleteQuestion = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/questions/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      // remove from UI instantly
      setQuestions(questions.filter(q => q._id !== id));

      alert("Question deleted");

    } catch (error) {

      console.error(error);
      alert("Delete failed");

    }

  };


  return (

    <div className="p-8 bg-gray-100 min-h-screen">

      <h2 className="text-3xl font-bold mb-6">
        Coding Questions
      </h2>

      <div className="grid gap-6">

        {questions.map((q) => (

          <div
            key={q._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition relative"
          >

            {/* DELETE BUTTON (ADMIN ONLY) */}
            {isAdmin && (
              <button
                onClick={() => deleteQuestion(q._id)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            )}

            {isAdmin && (
  <button
    onClick={() => navigate(`/admin/edit/${q._id}`)}
    className="absolute top-3 right-20 bg-blue-500 text-white px-3 py-1 rounded text-sm"
  >
    Edit
  </button>
)}

            <div onClick={() => navigate(`/editor/${q._id}`)}>

              <h3 className="text-xl font-bold mb-2">
                {q.title}
              </h3>

              <p className="text-gray-600 mb-3">
                {q.description}
              </p>

              <span className={`text-sm px-3 py-1 rounded ${
                q.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : q.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {q.difficulty}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Questions;