import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await register(input.username, input.email, input.password);
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-50">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8 bg-white rounded-lg w-full max-w-md">
        <div className="my-4">
          <h1 className="text-center font-bold text-3xl mb-2">Instagram</h1>
          <p className="text-sm text-center text-gray-600">
            Sign up to see photos and videos from your friends
          </p>
        </div>
        <div>
          <span className="py-2 font-medium text-sm">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>
        <div>
          <span className="py-2 font-medium text-sm">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>
        <div>
          <span className="py-2 font-medium text-sm">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 font-medium hover:underline"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};
export default Signup;