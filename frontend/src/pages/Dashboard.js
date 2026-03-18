import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome to DevPrep AI Coding Platform 🚀
      </p>

      <div className="grid grid-cols-3 gap-6">

        <div
          className="bg-white shadow rounded p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/questions")}
        >
          <h2 className="text-xl font-bold mb-2">
            Questions
          </h2>

          <p className="text-gray-500">
            Practice coding problems
          </p>
        </div>

        <div
          className="bg-white shadow rounded p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/submissions")}
        >
          <h2 className="text-xl font-bold mb-2">
            Submissions
          </h2>

          <p className="text-gray-500">
            View your past submissions
          </p>
        </div>

        <div
          className="bg-white shadow rounded p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/leaderboard")}
        >
          <h2 className="text-xl font-bold mb-2">
            Leaderboard
          </h2>

          <p className="text-gray-500">
            See top coders
          </p>
        </div>

      </div>

    </div>

  );

}

export default Dashboard;