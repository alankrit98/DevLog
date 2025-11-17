const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubLink: { type: String },
    liveLink: { type: String },
    tags: [{ type: String }], // e.g., ["React", "MERN"]
    
    // Link the project to the User who created it
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);