import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  // Check if we are already following this creator
  // Note: We use 'some' or 'includes' depending on if the ID is stored as string or object
  const isFollowingInitially = currentUser?.following?.includes(project.creator._id);
  const [followed, setFollowed] = useState(isFollowingInitially);

  // Chat and Comments State
  const [showChat, setShowChat] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const socket = useRef();

  useEffect(() => {
    if (showChat) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("join_project", project._id);

      // Load initial history
      axios.get(`http://localhost:5000/api/comments/${project._id}`)
           .then(res => setComments(res.data));

      // Listen for real-time comments
      socket.current.on("receive_comment", (data) => {
        setComments((prev) => [...prev, data]);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [showChat, project._id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentData = {
        project: project._id,
        text: newComment,
        user: { _id: currentUser._id, username: currentUser.username, avatar: currentUser.avatar }
    };

    // 1. Send to Socket (Instant update for others)
    socket.current.emit("send_comment", commentData);

    // 2. Save to DB
    await axios.post('http://localhost:5000/api/comments', 
        { text: newComment, projectId: project._id },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setNewComment("");
  };

  const handleFollow = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (followed) {
        await axios.put(`http://localhost:5000/api/users/unfollow/${project.creator._id}`, {}, config);
        
        // Update LocalStorage so the UI stays consistent on refresh
        currentUser.following = currentUser.following.filter(id => id !== project.creator._id);
      } else {
        await axios.put(`http://localhost:5000/api/users/follow/${project.creator._id}`, {}, config);
        
        // Add to LocalStorage
        currentUser.following.push(project.creator._id);
      }

      localStorage.setItem('user', JSON.stringify(currentUser));
      setFollowed(!followed);
      
    } catch (error) {
      console.error("Follow Error", error);
      alert("Something went wrong");
    }
  };

  // Don't show follow button if it's my own project
  const isMyProject = currentUser?._id === project.creator._id;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 hover:shadow-lg transition border-l-4 border-green-500">
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-2xl font-bold text-gray-800">{project.title}</h3>
            <div className="flex items-center gap-2 mb-2">
                <p className="text-sm text-gray-500">
                  by <Link to={`/profile/${project.creator?._id}`} className="font-bold text-green-600 hover:underline">
    @{project.creator?.username || 'Unknown'}
</Link>
                </p>
                
                {/* FOLLOW BUTTON LOGIC */}
                {!isMyProject && (
                    <button 
                        onClick={handleFollow}
                        className={`text-xs px-2 py-1 rounded font-bold transition ${
                            followed 
                            ? "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500" 
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        }`}
                    >
                        {followed ? "Unfollow" : "+ Follow"}
                    </button>
                )}
            </div>
        </div>
        <span className="text-xs text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 mb-4 mt-2">{project.description}</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {project.tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
            #{tag.trim()}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mt-4 border-t pt-4">
        {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-gray-900 hover:text-green-500 font-bold text-sm">
                GitHub
            </a>
        )}
        {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                Live Demo
            </a>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button 
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-bold transition"
        >
            💬 {showChat ? "Hide Discussion" : "Discuss / Feedback"}
        </button>

        {showChat && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg animate-fade-in">
                <div className="h-40 overflow-y-scroll mb-4 space-y-2 border p-2 bg-white rounded">
                    {comments.length === 0 && <p className="text-xs text-gray-400">No comments yet.</p>}
                    {comments.map((c, i) => (
                        <div key={i} className="text-sm">
                            <span className="font-bold text-green-600">{c.user?.username}: </span>
                            <span className="text-gray-700">{c.text}</span>
                        </div>
                    ))}
                </div>
                
                {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            placeholder="Share your thoughts..."
                        />
                        <button type="submit" className="bg-green-500 text-white text-xs px-3 py-1 rounded font-bold">
                            Send
                        </button>
                    </form>
                ) : (
                    <p className="text-xs text-red-500">Login to discuss.</p>
                )}
            </div>
        )}
      </div>

    </div>
  );
};

export default ProjectCard;