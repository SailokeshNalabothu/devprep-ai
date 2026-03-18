import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");

    } catch (error) {

      alert("Invalid credentials");

    }

  };

  return (

    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          DevPrep AI
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Coding Interview Platform
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 ml-1 font-medium">
            Sign up
          </Link>
        </p>

      </div>

    </div>

  );

}

export default Login;