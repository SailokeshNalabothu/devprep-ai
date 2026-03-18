import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const fetchLeaderboard = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/leaderboard"
        );

        setUsers(res.data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchLeaderboard();

  }, []);


  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        🏆 Leaderboard
      </h1>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-200">

          <tr>
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">User</th>
            <th className="p-3 text-left">Problems Solved</th>
          </tr>

        </thead>

        <tbody>

          {users.map((user, index) => (

            <tr key={index} className="border-t">

              <td className="p-3">{index + 1}</td>
              <td className="p-3">{user.user}</td>
              <td className="p-3">{user.solved}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Leaderboard;