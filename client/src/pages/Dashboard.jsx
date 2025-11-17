import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard'; // Import the card we just made

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [newProject, setNewProject] = useState({ title: '', description: '', githubLink: '', liveLink: '', tags: '' });
  const navigate = useNavigate();
  
  // Get user and token
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // 1. Fetch Projects on Load
  useEffect(() => {
    if (!user) navigate('/login');
    fetchProjects();
  }, []);

  const fetchProjects = async (query = "") => {
    try {
      // If query exists, append it to URL. Otherwise fetch all.
      const url = query 
        ? `https://devlog-245n.onrender.com/api/projects?search=${query}` 
        : 'https://devlog-245n.onrender.com/api/projects';
      
      const res = await axios.get(url);
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  // 2. Handle Input Change
  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }, // Attach Token!
      };
      
      await axios.post('https://devlog-245n.onrender.com/api/projects', newProject, config);
      
      // Refresh feed and clear form
      fetchProjects();
      setNewProject({ title: '', description: '', githubLink: '', liveLink: '', tags: '' });
      alert('Project Posted!');
    } catch (error) {
      console.error(error);
      alert('Failed to post project');
    }
  };

  // 4. Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects(search); // Call fetch with the current search text
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: Post Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">🚀 Share Project</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              name="title" value={newProject.title} onChange={handleChange}
              placeholder="Project Title" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" required 
            />
            <textarea 
              name="description" value={newProject.description} onChange={handleChange}
              placeholder="Description" className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none h-24" required 
            />
            <p className="text-xs text-gray-400 mt-1 mb-3">
  Tip: Use <b>```</b> to highlight code blocks (e.g., ```console.log('Hi')```)
</p>
            <input 
              name="tags" value={newProject.tags} onChange={handleChange}
              placeholder="Tags (e.g. React, API)" className="border p-2 rounded outline-none" 
            />
            <input 
              name="githubLink" value={newProject.githubLink} onChange={handleChange}
              placeholder="GitHub URL" className="border p-2 rounded outline-none" 
            />
            <input 
              name="liveLink" value={newProject.liveLink} onChange={handleChange}
              placeholder="Live Demo URL" className="border p-2 rounded outline-none" 
            />
            <button type="submit" className="bg-gray-900 text-white py-2 rounded font-bold hover:bg-gray-800 transition">
              Post Project
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Feed */}
      <div className="md:col-span-2">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Community Feed</h2>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Search projects, tags..." 
                value={search}
                onChange={(e) => {
        setSearch(e.target.value);
        // If user clears the box, reset the feed automatically
        if(e.target.value === "") {
            fetchProjects("");
        }
    }}
                className="border p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64"
            />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-r hover:bg-gray-700">
                Search
            </button>
            {/* Reset Button */}
            {search && (
                <button 
                    type="button" 
                    onClick={() => { setSearch(""); fetchProjects(""); }}
                    className="text-gray-500 hover:text-red-500 text-sm font-bold px-2"
                >
                    Clear
                </button>
            )}
        </form>
      </div>
        {projects.length > 0 ? (
            projects.map((p) => <ProjectCard key={p._id} project={p} />)
        ) : (
            <p className="text-gray-500">No projects yet. Be the first to post!</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;