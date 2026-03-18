import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    navigate("/");

  };

  return (

    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

      <h1 className="font-bold text-xl">
        DevPrep AI
      </h1>

      <div className="space-x-6">

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/questions">Questions</Link>

        <Link to="/submissions">Submissions</Link>

        <Link to="/leaderboard">Leaderboard</Link>

        <Link to="/profile">Profile</Link>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
        <button onClick={() => navigate("/admin")}>
  Admin
</button>

      </div>

    </div>

  );

}

export default Navbar;