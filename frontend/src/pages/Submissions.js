import { useEffect, useState } from "react";
import axios from "axios";

function Submissions() {

  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {

    const fetchSubmissions = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/submissions/my-submissions",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        setSubmissions(res.data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchSubmissions();

  }, []);

  return (

    <div className="p-8">

      <h2 className="text-3xl font-bold mb-6">
        Submission History
      </h2>

      <div className="bg-white shadow rounded overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3 text-left">Question ID</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {submissions.map((s) => (

              <tr key={s._id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {s.questionId}
                </td>

                <td className="p-3">
                  {s.language}
                </td>

                <td className="p-3 font-semibold">

                  {s.status === "Accepted"
                    ? <span className="text-green-600">Accepted</span>
                    : <span className="text-red-600">{s.status}</span>
                  }

                </td>

                <td className="p-3">
                  {new Date(s.createdAt).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Submissions;