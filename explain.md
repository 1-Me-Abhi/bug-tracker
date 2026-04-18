# Building "BugFlow" ─ A MERN Bug Tracker

Hello! I'd like to walk you through the process of how I built our Bug Tracker application, **BugFlow**.

## 1. Project Overview & Objective
The goal was to build a comprehensive, full-stack issue tracking system where teams can manage projects, report bugs, and track progress seamlessly. I chose the **MERN** stack (MongoDB, Express, React, Node.js) because of its robust performance and uniform JavaScript ecosystem.

## 2. Architecture & Tech Stack
I separated the application into a decoupled client and server architecture:
*   **Frontend (Client):** React.js (built with Vite for faster development builds).
*   **Backend (Server):** Node.js with Express.js REST API.
*   **Database:** MongoDB Atlas (NoSQL DB, interfaced via Mongoose ODM).

## 3. The Backend: API & Database Design
I started by conceptualizing the database schemas to represent the core entities of a bug tracker:
*   **Users:** Handling authentication, roles, and assignments.
*   **Projects:** Groupings of issues (e.g., containing Title, Description, and Owner).
*   **Issues/Tickets:** The core entity containing its title, status (To Do, In Progress, Done), priority, assignee, and the reference to its parent project.

**API Implementation:**
I built standard RESTful routes (`GET`, `POST`, `PUT`, `DELETE`) for managing these entities. For example, updating a project description or transitioning an issue's status relies on secure `PUT` requests back to the server.

## 4. The Frontend: UI & State Management
For the frontend, I wanted the application to feel premium, responsive, and easy to navigate. 

### Transition from Tailwind to Vanilla CSS
Initially, the styling relied on utility classes (TailwindCSS), but as the app grew, I noticed some layout stretching and inconsistency. 
**My solution:** I completely refactored the UI to use a **pure Vanilla CSS custom design system** (`index.css`). 
*   I implemented a **"Dark Glassmorphism"** aesthetic.
*   I defined global CSS variables for colors (e.g., `--dark-900` to `--dark-100`, specific accents) to ensure visual consistency.
*   I standardized reusable components (Cards, Sidebars, Modals, Buttons) into semantic CSS classes rather than inline utility strings. This immediately fixed layout issues and gave me explicit control over hover micro-animations and flex-box constraints.

### Core Features & Pages
1.  **Dashboard / Stats:** Gives an overarching view of active bugs, completions, and performance.
2.  **Projects View:** Allows creation and updating of distinct projects via Modals.
3.  **Kanban Board:** A visual representation of issues categorized by states (To Do, In Progress, Done), making it highly intuitive for users.
4.  **Issue Details:** Deep dive into specific tickets (descriptions, priority updates).

## 5. Key Challenges & Learnings
*   **State Management on Updates:** Ensuring that when a user updates a project or issue via the modal (`ProjectModal.jsx`), the frontend state is updated synchronously alongside the successful API response without requiring a full page refresh.
*   **Layout Constraints:** Building the Kanban columns to scroll independently without breaking the main viewport required careful CSS flexbox planning.
*   **Environment Configuration:** Securely managing credentials, specifically updating MongoDB Atlas credentials dynamically while keeping the `.env` strictly out of version control.

## 6. Deployment Strategy
The app is designed to be cloud-ready:
*   The Backend is structured to run on environments like **Render** or **Railway**.
*   The Frontend built with Vite easily deploys to **Vercel** or **Netlify**.

## Conclusion
Building this bug tracker was a massive learning experience in standardizing UI without frameworks, managing relational states in NoSQL, and producing clean, scalable code. I'm very happy with how the dark aesthetic and the API infrastructure turned out!
