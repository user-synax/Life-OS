
# 🚀 Life OS - Your Personal Productivity Command Center

<p align="center">
  <img src="https://i.imgur.com/sZqL9M8.png" alt="Life OS Banner" width="800"/>
</p>

<p align="center">
  <strong>A sleek, modern, and highly customizable dashboard to organize, track, and optimize your life.</strong>
</p>

<p align="center">
  <a href="#-core-features">Core Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Introduction

**Life OS** is not just another productivity app; it's a centralized command center for your digital life. Built with a focus on speed, aesthetics, and modularity, it provides a beautiful and efficient interface to manage your tasks, notes, habits, and more. The design philosophy is inspired by futuristic UI, tactical dashboards, and the clean efficiency of modern developer tools.

Whether you're a developer, a student, or a professional, Life OS offers the tools you need to stay on top of your goals in a visually stunning package.

## 🌟 Core Features

- **Unified Dashboard**: A fully customizable grid-based dashboard where you can add, remove, and rearrange widgets to fit your workflow.
- **Modular Widgets**: A growing library of widgets including:
  - **Tasks**: A powerful task manager with priorities and status tracking.
  - **Notes**: A simple and elegant note-taking system.
  - **Calendar**: Keep track of your important events.
  - **Habit Tracker**: Build good habits with a visual tracker.
  - **Focus Timer**: A Pomodoro-style timer to boost your productivity.
  - **Analytics**: Visualize your productivity data over time.
- **Blazing Fast Search**: A `Cmd+K` command palette to instantly search, navigate, and execute commands across the entire application.
- **Modern Authentication**: Secure, JWT-based authentication for user registration and login.
- **Theming**: A clean, dark-mode-first design system built with Tailwind CSS, easily adaptable to your preferences.
- **Responsive Design**: A seamless experience across all your devices, from desktop to mobile.

## 🛠️ Tech Stack

Life OS is built with a modern, robust, and scalable technology stack:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `shadcn/ui` for component primitives.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for lightweight, global state management.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for data modeling.
- **Authentication**: [JWT](https://jwt.io/) & [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) for secure password hashing.
- **UI/UX**: `framer-motion` for animations and `lucide-react` for icons.

## 🚀 Getting Started

Follow these instructions to get a local copy of Life OS up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based via MongoDB Atlas).

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/life-os.git
   cd life-os
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of the project and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action!

## 📸 Screenshots

*A picture is worth a thousand words. Here's a glimpse into Life OS.*

<p align="center">
  <img src="https://i.imgur.com/EXAMPLE_LOGIN.png" alt="Login Screen" width="48%">
  &nbsp;
  <img src="https://i.imgur.com/EXAMPLE_DASH.png" alt="Dashboard" width="48%">
</p>
<p align="center"><em>Login Screen & Main Dashboard</em></p>

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

<p align="center"><em>Crafted with ❤️ for the modern operator.</em></p>
