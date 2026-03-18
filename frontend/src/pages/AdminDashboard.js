import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        🛠 Admin Panel
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/add")}
        >
          ➕ Add Question
        </div>

        <div
          className="bg-white p-6 shadow rounded cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/questions")}
        >
          📋 Manage Questions
        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;