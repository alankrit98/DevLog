import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

// Dashboard Component
// const Dashboard = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
  
//   // Security check: If no user, kick them back to login
//   if (!user) return <Navigate to="/login" />;

//   return (
//     <div className="p-10 text-gray-800"> {/* Added text color */}
//       <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
//       <p>Welcome back, <span className="font-bold text-green-600">{user.username}</span>!</p>
//       {/* We will add the Project Form here soon */}
//     </div>
//   );
// };

// Home Component
const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // If user is already logged in, don't show landing page, go to Dashboard
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="text-center mt-20 px-4">
      <h1 className="text-5xl font-bold mb-4 text-gray-900">Share your code. <br/> Find your squad.</h1>
      <p className="text-gray-600 mb-8 text-lg">The social platform for developers to showcase projects and collaborate.</p>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* Main Wrapper with Background Color for the whole app */}
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;