import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Suggestions from './components/Suggestions';

import Signup from './components/Signup';
import Login from './components/Login';

import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Search from './pages/Search';

import './App.css';

function AppWrapper() {
  const location = useLocation();
  const hideSuggestions = location.pathname === '/messages'; 

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 min-h-screen px-0 md:px-6 mt-[-4px]">
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!hideSuggestions && <Suggestions />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppWrapper />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
