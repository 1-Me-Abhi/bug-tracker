# BugFlow - MERN Stack Issue Tracker

A full-stack Bug Tracker and Issue Management application built with the MERN stack (MongoDB, Express, React, Node.js). 

## Features

*   **Authentication**: User registration and login utilizing JSON Web Tokens (JWT) and bcrypt password hashing.
*   **Project Management**: Create, view, update, and delete projects. Manage project team members.
*   **Issue/Ticket Tracking**: Full CRUD operations for project issues. Each issue supports fields like Title, Description, Type (Bug, Feature, etc.), Priority, Status, Assignee, and File Attachments.
*   **Kanban Board**: Drag-and-drop Kanban functionality to easily manage issue statuses (To Do, In Progress, In Review, Done).
*   **Real-time Collaboration**: Real-time updates via Socket.io ensure you immediately see when tickets are updated or comments are added.
*   **Comments**: Threaded issue comments for seamless team communication.
*   **Advanced Filtering & Search**: Find the right tickets quickly with dropdown filters (status, priority, assignee) and keyword search.
*   **Modern UI**: Beautiful, responsive layout built with Tailwind CSS, utilizing glassmorphism aspects, micro-interactions, responsive sidebars, loaders/spinners, and toast notifications.

## Tech Stack

**Frontend:**
*   React (with Vite)
*   Tailwind CSS (v4)
*   React Router DOM
*   @hello-pangea/dnd (for Kanban drag & drop)
*   Socket.io-client
*   React Hot Toast (for notifications)

**Backend:**
*   Node.js & Express.js
*   MongoDB (Mongoose ODM)
*   JSON Web Tokens (Auth)
*   Bcryptjs (Password hashing)
*   Multer (File uploads)
*   Socket.io (Real-time events)

## Getting Started

### Prerequisites
*   Node.js installed
*   MongoDB Atlas cluster (or local MongoDB instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/bugflow.git
    cd bugflow
    ```

2.  **Setup Backend Server:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add your configurations:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bugtracker?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_key
    CLIENT_URL=http://localhost:5173
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Setup Frontend Client:**
    Open a new terminal window:
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Open the App:** Navigate to `http://localhost:5173` in your browser.

## Deployment Notes
*   **Backend**: Can be deployed on services like Render, Railway, or Heroku. Ensure environment variables and CORS origins are properly configured.
*   **Frontend**: Can be deployed on Vercel or Netlify. Update API base URL to point to the deployed backend.
*   **Database**: MongoDB Atlas handles the cloud deployment of the database.
