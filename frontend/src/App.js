import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import Editor from "./pages/Editor";
import Submissions from "./pages/Submissions";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AddQuestion from "./pages/AddQuestion";
import EditQuestion from "./pages/EditQuestion";


function Layout() {

  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

  return (

    <>

      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/questions" element={<Questions />} />

        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/editor/:id" element={<Editor />} />

        <Route path="/submissions" element={<Submissions />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/add" element={<AddQuestion />} />

        <Route path="/admin/edit/:id" element={<EditQuestion />} />


      </Routes>

    </>

  );

}

function App() {

  return (

    <Router>
      <Layout />
    </Router>

  );

}

export default App;