import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/input';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Search = () => {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authAPI.getSuggestedUsers();
      if (data.success) {
        const users = data.users.filter(u => u._id !== currentUser?._id);
        setAllUsers(users);
      }
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = allUsers.filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, allUsers]);

  const renderProfilePic = (userObj, size = 40) => (
    <img
      src={userObj?.profilePicture || `https://via.placeholder.com/${size}?text=User`}
      alt={userObj?.username || 'User'}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      onError={e => (e.target.src = `https://via.placeholder.com/${size}?text=User`)}
    />
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl">
      <Input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mb-4 w-full"
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : results.length === 0 && query.trim() ? (
        <p className="text-center text-gray-500 py-8">No users found</p>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map(u => (
            <Link
              key={u._id}
              to={`/profile/${u._id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {renderProfilePic(u, 36)}
              <div>
                <p className="font-semibold text-sm">{u.username}</p>
                <p className="text-xs text-gray-500">{u.email || 'New on Instagram'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
