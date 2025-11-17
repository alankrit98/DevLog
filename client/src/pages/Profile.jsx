import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const Profile = () => {
  const { id } = useParams(); // Get ID from URL
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // For Editing
  const [editFormData, setEditFormData] = useState({ username: '', bio: '', skills: '', avatar: '' });

  const [file, setFile] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Check if this is MY profile
  const isMyProfile = currentUser?._id === id;

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://devlog-245n.onrender.com/api/users/${id}`);
        setProfile(res.data);
        // Pre-fill form data
        setEditFormData({
            username: res.data.user.username,
            bio: res.data.user.bio || "",
            skills: res.data.user.skills.join(', ') || "",
            avatar: res.data.user.avatar
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [id]);

  // Handle Edit Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // We must use FormData to send files
    const formData = new FormData();
    formData.append('username', editFormData.username);
    formData.append('bio', editFormData.bio);
    formData.append('skills', editFormData.skills);
    
    // Only append the file if the user picked one
    if (file) {
        formData.append('avatar', file);
    }

    try {
        const res = await axios.put('https://devlog-245n.onrender.com/api/users/profile', formData, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // <--- Critical for files
            }
        });

        // Update local storage and UI
        const updatedUser = { ...currentUser, ...res.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Error updating profile');
    }
  };

  if (!profile) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="container mx-auto p-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        {isEditing ? (
            // --- EDIT MODE ---
            <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <input 
                    value={editFormData.username} 
                    onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                    className="border p-2 rounded" placeholder="Username"
                />
                <textarea 
                    value={editFormData.bio} 
                    onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})}
                    className="border p-2 rounded" placeholder="Bio / About Me"
                />
                <input 
                    value={editFormData.skills} 
                    onChange={(e) => setEditFormData({...editFormData, skills: e.target.value})}
                    className="border p-2 rounded" placeholder="Skills (comma separated)"
                />
                <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-gray-600">Profile Picture</label>
    
    {/* The File Chooser Button */}
    <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded bg-white"
    />
</div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
            </form>
        ) : (
            // --- VIEW MODE ---
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                    src={profile.user.avatar} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-green-500 object-cover" 
                />
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{profile.user.username}</h1>
                    <p className="text-gray-600 mt-2">{profile.user.bio || "No bio yet."}</p>
                    
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                        {profile.user.skills.map((skill, i) => (
                            <span key={i} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-6 mt-6 justify-center md:justify-start text-gray-600">
                        <span><strong>{profile.user.followers.length}</strong> Followers</span>
                        <span><strong>{profile.user.following.length}</strong> Following</span>
                        <span><strong>{profile.projects.length}</strong> Projects</span>
                    </div>
                </div>
                
                {/* Action Button */}
                <div>
                    {isMyProfile && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* PROJECTS GRID */}
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Projects by {profile.user.username}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile.projects.length > 0 ? (
            profile.projects.map(p => (
                // We need to pass the full creator object because ProjectCard expects it
                <ProjectCard key={p._id} project={{...p, creator: profile.user}} />
            ))
        ) : (
            <p className="text-gray-500">Hasn't posted any projects yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;