import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Check if user data exists in local storage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo: If logged in, go to Dashboard, else Home */}
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-green-400 tracking-wider">
          &lt;DevLog /&gt;
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              {/* Show this if user IS logged in */}
              <span className="text-gray-300">Hello, {user.username}</span>
              <Link to="/dashboard" className="hover:text-green-400 transition">Dashboard</Link>
              <Link to="/chat" className="hover:text-green-400 transition">Chat</Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show this if user is NOT logged in */}
              <Link to="/login" className="hover:text-green-400 transition">Login</Link>
              <Link to="/register" className="bg-green-500 text-gray-900 px-4 py-2 rounded font-bold hover:bg-green-400 transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;