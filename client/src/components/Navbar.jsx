import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const socket = useRef();

  // 1. Setup Socket & Fetch Data
  useEffect(() => {
    if (!user) return;

    // Connect Socket
    socket.current = io("https://devlog-245n.onrender.com");
    socket.current.emit("join_user_room", user._id); // Ensure we join our private room

    // Listen for alerts
    socket.current.on("new_notification", (data) => {
       setNotifications((prev) => [data, ...prev]);
    });

    // Fetch past notifications
    const fetchNotifications = async () => {
        try {
            const res = await axios.get('https://devlog-245n.onrender.com/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchNotifications();

    return () => socket.current.disconnect();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMarkRead = async () => {
    if (unreadCount > 0) {
        await axios.put('https://devlog-245n.onrender.com/api/notifications/read', {}, {
             headers: { Authorization: `Bearer ${token}` }
        });
        // Update local state
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-green-400 tracking-wider">
          &lt;DevLog /&gt;
        </Link>

        <div className="flex gap-6 items-center">
          {user ? (
            <>
              {/* 1. CHAT ICON (Added Back) */}
              <Link to="/chat" className="text-2xl hover:text-green-400 transition" title="Messages">
                Chat
              </Link>
              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button onClick={handleMarkRead} className="relative text-2xl hover:text-gray-300 transition">
                    🔔
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* DROPDOWN */}
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden border">
                        <div className="p-2 border-b font-bold bg-gray-50">Notifications</div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-sm text-gray-500 text-center">No notifications yet.</p>
                            ) : (
                                notifications.map((n, i) => (
                                    <div key={i} className={`p-3 border-b text-sm flex items-center gap-2 ${n.read ? 'bg-white' : 'bg-blue-50'}`}>
                                        <img src={n.sender.avatar} alt="av" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <span className="font-bold">{n.sender.username} </span>
                                            {n.type === 'like' && `liked your project`}
                                            {n.type === 'comment' && `commented on your project`}
                                            {n.type === 'follow' && `started following you`}
                                            <div className="text-xs text-gray-400">
                                                {new Date(n.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>

              <Link to={`/profile/${user._id}`} className="text-gray-300 hover:text-white font-bold">
                Hello, {user.username}
              </Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
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