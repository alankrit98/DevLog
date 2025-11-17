import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save the Token and User info to LocalStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      alert('Login Successful!');
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        
        <input 
          type="email" name="email" placeholder="Email" 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          onChange={handleChange} 
          className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required 
        />
        
        <button type="submit" className="w-full bg-green-500 text-gray-900 font-bold p-2 rounded hover:bg-green-400 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;