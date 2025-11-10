import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { toast } from 'sonner';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authAPI.getCurrentUser();
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Login error:', err);
      let message = 'Login failed';
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        message = 'Cannot connect to server. Make sure backend is running on port 8000';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authAPI.register({ username, email, password });
      if (data.success) {
        toast.success(data.message);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Registration error:', err);
      let message = 'Registration failed';
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        message = 'Cannot connect to server. Make sure backend is running on port 8000';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success('Logged out successfully');
      return { success: true };
    } catch {
      toast.error('Logout failed');
      return { success: false };
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider };
