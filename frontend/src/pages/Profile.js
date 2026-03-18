import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        setProfile(res.data);

      } catch (error) {

        console.error("Error fetching profile:", error);

      }

    };

    fetchProfile();

  }, []);


  if (!profile) return <div className="p-6">Loading...</div>;


  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        👤 User Profile
      </h1>


      {/* GENERAL STATS */}
      <div className="bg-white shadow p-6 rounded mb-6">

        <p className="mb-3">
          <strong>Total Submissions:</strong> {profile.totalSubmissions}
        </p>

        <p className="mb-3">
          <strong>Problems Solved:</strong> {profile.solvedProblems}
        </p>

        <p>
          <strong>Success Rate:</strong> {profile.successRate}%
        </p>

      </div>


      {/* DIFFICULTY STATS */}
      <div className="bg-white shadow p-6 rounded">

        <h2 className="text-xl font-bold mb-4">
          Difficulty Stats
        </h2>

        <p className="mb-2">
          🟢 Easy Solved: {profile.difficultyStats?.easy || 0}
        </p>

        <p className="mb-2">
          🟡 Medium Solved: {profile.difficultyStats?.medium || 0}
        </p>

        <p>
          🔴 Hard Solved: {profile.difficultyStats?.hard || 0}
        </p>

      </div>

    </div>

  );

}

export default Profile;