import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Ensure your backend is running on port 5000
      await axios.post('https://devlog-245n.onrender.com/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join DevLog</h2>
        
        <input 
          type="text" name="username" placeholder="Username" 
          onChange={handleChange} 
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required 
        />
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
        
        <button type="submit" className="w-full bg-gray-900 text-white p-2 rounded hover:bg-gray-800 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;