import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MessageCircle, PlusSquare, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Header = () => {
  const { user } = useAuth();
  const { hasUnread } = useNotifications();

  if (!user) return null;

  const tagline = "Color your life 💖✨";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          
         
          <Link to="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-6 h-6"
            >
              <defs>
                <linearGradient id="gradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="25%" stopColor="#e6683c" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="75%" stopColor="#cc2366" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <path
                fill="url(#gradientLogo)"
                d="M224.1 141c-63.6 0-115 51.4-115 115s51.4 115 115 115 115-51.4 115-115-51.4-115-115-115zm0 190c-41.3 0-75-33.7-75-75s33.7-75 75-75 75 33.7 75 75-33.7 75-75 75zm146.4-194.7c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-.1-54.2-4.9-102.3-44.8-142.1C371.1 9.8 322.9 5 268.7 5H179.3C125.1 5 76.9 9.8 37.9 49.9 1.6 86.3-3.2 134.5-3.1 188.7v89.4c-.1 54.2 4.9 102.3 44.8 142.1 39.9 39.9 88.1 44.7 142.3 44.6h89.4c54.2.1 102.3-4.9 142.1-44.8 39.9-39.9 44.7-88.1 44.6-142.3v-89.4zM398.8 338c-21.5 21.5-49.8 25.5-76.8 25.6h-89.4c-27.1-.1-55.3-4.1-76.8-25.6-21.5-21.5-25.5-49.8-25.6-76.8v-89.4c.1-27.1 4.1-55.3 25.6-76.8 21.5-21.5 49.8-25.5 76.8-25.6h89.4c27.1.1 55.3 4.1 76.8 25.6 21.5 21.5 25.5 49.8 25.6 76.8v89.4c-.1 27.1-4.1 55.3-25.6 76.8z"
              />
            </svg>
            <span
              className="text-2xl font-extrabold"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1,
                letterSpacing: "1px",
              }}
            >
              Instaclone
            </span>
          </Link>

          <div className="flex-1 flex justify-center items-center">
            <span
              className="text-lg md:text-xl lg:text-2xl font-extrabold"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(90deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
                textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
              }}
            >
              {tagline}
            </span>
          </div>

         
          <div className="flex items-center gap-6">
            <Link to="/create-post">
              <PlusSquare className="w-6 h-6 text-gray-600 hover:text-black transition" />
            </Link>
            <Link to="/messages">
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-black transition" />
            </Link>
            <Link to="/notifications" className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-black transition" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 block w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </Link>
            <Link to={`/profile/${user._id}`}>
              <User className="w-6 h-6 text-gray-600 hover:text-black transition" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
