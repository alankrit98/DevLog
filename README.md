# 🚀 DevLog - The Social Network for Developers

![MERN Stack](https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=mongodb&logoColor=green)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**DevLog** is a full-stack social platform designed for developers to showcase projects, collaborate, and network. Built with the MERN Stack, it features real-time communication, a rich content feed with code syntax highlighting, and a dynamic social graph.

## 🌐 Live Demo
**Frontend:** [Deployment](https://dev-log-al.vercel.app/)

---

## ✨ Key Features

- **💬 Real-Time Chat:** Instant private messaging and live project discussion rooms powered by **Socket.io**.
- **🔔 Notifications System:** Real-time alerts for likes, comments, and new followers.
- **❤️ Interactive Social Graph:** Follow/Unfollow developers and "Like" projects with optimistic UI updates.
- **📝 Developer-Centric Feed:** Create, edit, and delete projects. Supports **Syntax Highlighting** for code blocks.
- **🔍 Smart Search:** Server-side regex search to filter projects by title, tags, or tech stack.
- **☁️ Cloud Integration:** **Cloudinary** integration for secure profile picture and project image uploads.
- **🔐 Authentication:** Secure JWT-based login and registration system.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React (Vite), TailwindCSS, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **Real-Time** | Socket.io (WebSockets) |
| **Storage** | Cloudinary API |
| **Authentication** | JSON Web Tokens (JWT) + BCrypt |

---

## 📸 Screenshots

| Dashboard Feed | Real-time Chat |
|:---:|:---:|
| [Dashboard](./dashboard.png) | [Chat Feature](./chat.png) |

| Project Details | User Profile |
|:---:|:---:|
| [Project Details](./projectdetails.png) | [User Profile](./profile.png) |

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```
git clone [https://github.com/yourusername/DevLog.git](https://github.com/yourusername/DevLog.git)
cd DevLog
```

### 2. Backend Setup
```
cd server
npm install
Create a .env file in the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Run the Server:

npm run dev
```

### 3. Frontend Setup
```
Open a new terminal:

cd client
npm install
Update API URL: Check src/utils/api.js (or where you defined axios) to ensure it points to http://localhost:5000.

Run the Client:

npm run dev
```

---

## Future Enhancements
These are the features planned for the next release:
- **🌙 Dark Mode:** System-wide dark theme toggle.
- **📱 Mobile Responsiveness:** PWA (Progressive Web App) support for mobile installation.
- **📧 Email Notifications:** Weekly digest of top projects and new followers.
- **🏆 Gamification:** Badges for top contributors and "Project of the Week."
- **🔗 GitHub Integration:** Automatically import repositories as projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the [MIT License](LICENSE). See LICENSE for more information.
