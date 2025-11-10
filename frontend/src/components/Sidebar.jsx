import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  PlusSquare,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { hasUnread } = useNotifications();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/notifications', icon: Bell, label: 'Notifications', notification: hasUnread },
    { to: '/create-post', icon: PlusSquare, label: 'Create' },
    { to: `/profile/${user._id}`, icon: User, label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-white sticky top-16 h-[calc(100vh-4rem)] px-6 py-8">
      <nav className="flex flex-col justify-between h-full">
        <div className="space-y-3">
          {menuItems.map(({ to, icon: Icon, label, notification }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-6 flex justify-center relative">
                <Icon className="w-5 h-5" />
                {notification && (
                  <span className="absolute right-0 top-0 block w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-base font-medium">{label}</span>
            </Link>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-6 flex justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-base font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
