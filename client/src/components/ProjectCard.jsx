import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import CodeBlock from './CodeBlock';

const ProjectCard = ({ project }) => {
  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  // Check if we are already following this creator
  // Note: We use 'some' or 'includes' depending on if the ID is stored as string or object
  const isFollowingInitially = currentUser?.following?.includes(project.creator._id);
  const [followed, setFollowed] = useState(isFollowingInitially);

  // --- LIKE LOGIC ---
  //  State for likes count and status
  const [likes, setLikes] = useState(project.likes || []);
  const [isLiked, setIsLiked] = useState(project.likes?.includes(currentUser?._id));

  const handleLike = async () => {
    if (!currentUser) return alert("Please login to like projects");

    // Optimistic UI Update (Change color immediately before server responds)
    const previousLikes = [...likes];
    const previousStatus = isLiked;

    if (isLiked) {
        setLikes(likes.filter(id => id !== currentUser._id));
        setIsLiked(false);
    } else {
        setLikes([...likes, currentUser._id]);
        setIsLiked(true);
    }

    try {
        const res = await axios.put(`http://localhost:5000/api/projects/like/${project._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Sync with server response to be safe
        setLikes(res.data); 
    } catch (error) {
        // Revert if error
        setLikes(previousLikes);
        setIsLiked(previousStatus);
        console.error(error);
    }
  };

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
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        
        {/* LEFT: Title & Creator */}
        <div className="w-3/4"> {/* Limit width so it doesn't hit the heart */}
            <h3 className="text-2xl font-bold text-gray-800 leading-tight">{project.title}</h3>
            <div className="flex items-center gap-2 mt-1">
                <Link to={`/profile/${project.creator?._id}`} className="text-sm font-bold text-green-600 hover:underline">
                   @{project.creator?.username || 'Unknown'}
                </Link>
                {/* Follow Button Logic Here (Keep your existing button code) */}
                {!isMyProject && (
                    <button 
                        onClick={handleFollow}
                        className={`text-xs px-2 py-0.5 rounded font-bold transition border ${
                            followed 
                            ? "bg-white text-gray-500 border-gray-300 hover:bg-red-50 hover:text-red-500 hover:border-red-200" 
                            : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        }`}
                    >
                        {followed ? "Unfollow" : "+ Follow"}
                    </button>
                )}
            </div>
        </div>

        {/* RIGHT: Date & Like Button */}
        <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 mb-2">
                {new Date(project.createdAt).toLocaleDateString()}
            </span>
            
            <button 
                onClick={handleLike}
                className="flex items-center gap-1 group"
            >
                <span className={`text-2xl transition-transform group-active:scale-125 ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-300"}`}>
                    {isLiked ? "❤️" : "🤍"}
                </span>
                {likes.length > 0 && (
                    <span className="text-sm font-bold text-gray-500">{likes.length}</span>
                )}
            </button>
        </div>

      </div>

      <div className="mb-4 mt-2">
    <CodeBlock text={project.description} />
</div>

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