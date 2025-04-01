import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/loginService';
import { motion } from 'framer-motion';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await loginUser(email, password);
      navigate('/add-blog'); // Redirect after successful login
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }} 
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mb-4 text-red-500 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Mail className="w-5 h-5 text-gray-500 mr-2" />
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="flex-1 border-none focus:ring-0"
            />
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Lock className="w-5 h-5 text-gray-500 mr-2" />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="flex-1 border-none focus:ring-0"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            whileTap={{ scale: 0.95 }}
          >
            Login
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage;
