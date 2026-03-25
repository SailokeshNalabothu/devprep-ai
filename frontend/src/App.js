import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

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


import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";
  const isEditorPage = location.pathname.startsWith("/editor/");

  return (
    <div className="flex bg-[#fdfbf7] min-h-screen text-[#1a2e1a] overflow-hidden">
      {!isAuthPage && !isEditorPage && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#fdfbf7]">
        <main className={`flex-1 ${!isAuthPage && !isEditorPage ? 'overflow-y-auto' : 'flex flex-col'}`}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Authenticated Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
            <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Only Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/add" element={<ProtectedRoute adminOnly={true}><AddQuestion /></ProtectedRoute>} />
            <Route path="/admin/edit/:id" element={<ProtectedRoute adminOnly={true}><EditQuestion /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
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