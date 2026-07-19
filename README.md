# AskGPT: Your Intelligent AI Assistant 🤖


Welcome to **AskGPT**, an advanced AI chat assistant built with Next.js that leverages the power of AI models and a suite of real-world tools to provide comprehensive and reliable assistance. From complex programming challenges to fetching current weather, AskGPT is designed to be your go-to intelligent companion. ✨


## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Installation](#%EF%B8%8F-installation)
- [💡 Usage](#-usage)
- [📚 How to Use](#-how-to-use)
- [📂 Project Structure](#-project-structure)
- [🔗 Important Links](#-important-links)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [©️ Footer](#%EF%B8%8F-footer)

## ✨ Features

AskGPT comes packed with powerful features to enhance your AI interaction:

*   **Intelligent AI Assistant (AskGPT Persona)**: Designed to be reliable, versatile, and helpful across various domains including programming, writing, learning, research, brainstorming, debugging, planning, mathematics, and general knowledge. 🧠
*   **Persistent Chat History**: All your conversations are securely saved to a PostgreSQL database using Prisma, allowing you to pick up where you left off. 💾
*   **User Authentication**: Integrated with Clerk for seamless and secure user sign-up, sign-in, and session management. 🔒
*   **Tool-Augmented AI**: The AI has access to several real-world tools to provide accurate and up-to-date information:
    *   **Calculator**: Evaluate arithmetic expressions accurately, supporting `+`, `-`, `*`, `/`, `%`, `^`, and parentheses. 🧮
    *   **Current Date & Time**: Fetch the current date and time for any specified IANA timezone. ⏰
    *   **Weather Forecast**: Get real-time weather conditions for any named location (city, region, landmark). ☀️
    *   **Browser Search**: Perform live web searches to gather current information, news, and facts. 🌐
*   **Modern & Responsive UI**: Built with Next.js, React, Tailwind CSS, and Shadcn UI components for a sleek, intuitive, and mobile-friendly experience. 📱
*   **Dark Mode Support**: Enjoy a comfortable viewing experience with built-in light and dark themes. 🌙
*   **Robust Development Setup**: Includes TypeScript for type safety, ESLint for code quality, and Prisma for database interactions.

## 🚀 Tech Stack

This project is built using a modern and robust set of technologies:

| Category           | Technology        | Description                                       |
| :----------------- | :---------------- | :------------------------------------------------ |
| **Framework**      | Next.js           | React framework for production                    |
| **Language**       | TypeScript        | Type-safe JavaScript superset                     |
| **Frontend**       | React             | UI library                                        |
| **Styling**        | Tailwind CSS      | Utility-first CSS framework                       |
| **UI Components**  | Shadcn UI         | Reusable UI components built on Tailwind          |
| **AI Integration** | `@ai-sdk/groq`, `ai`, `@ai-sdk/react` | AI SDK for Groq and React integration             |
| **Database ORM**   | Prisma            | Next-generation ORM for Node.js and TypeScript    |
| **Database**       | PostgreSQL        | Powerful, open-source relational database         |
| **Authentication** | Clerk             | User management and authentication                |
| **Data Fetching**  | `@tanstack/react-query` | Asynchronous state management for React           |
| **Forms/Validation**| Zod               | Schema declaration and validation library         |
| **Notifications**  | Sonner            | Toast notifications for React                     |
| **Markdown Render**| Streamdown        | Fast and flexible Markdown parser/renderer        |

| **Environments**   | `dotenv`          | Loads environment variables from `.env` file      |
| **Icons**          | Lucide React      | Beautiful, customizable SVG icon library          |

## 🛠️ Installation

To get AskGPT up and running on your local machine, follow these steps:

### 1. Clone the Repository

First, clone the `ask-gpt` repository to your local machine:

```bash
git clone https://github.com/NJayantRao/ask-gpt.git
cd ask-gpt
```

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:

```bash
bun install
```

### 3. Environment Variables

Create a `.env` file in the root of your project based on `.env.example` (if available, otherwise refer to the following):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="sk_YOUR_CLERK_SECRET_KEY"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
GROQ_API_KEY="gsk_YOUR_GROQ_API_KEY"
```
### 4. Database Setup

Run Prisma migrations to set up your database schema:

```bash
bunx prisma migrate dev --name init
```

This will apply the schema defined in `prisma/schema.prisma`.

### 5. Start the Development Server

Now, start the Next.js development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 💡 Usage

AskGPT acts as a conversational AI assistant, designed to interact naturally and respond accurately using its integrated tools. You can ask it a wide variety of questions and tasks, and it will leverage its internal knowledge base and external tools to provide the best possible response. 💬

### Real-World Use Cases:

*   **Programming Assistance**: Ask for code snippets, debug issues, or understand complex algorithms.
*   **Research & Learning**: Get summaries of topics, explanations of concepts, or quick facts.
*   **Planning & Brainstorming**: Generate ideas, create outlines, or plan activities.
*   **Mathematics**: Perform complex calculations or solve mathematical problems.
*   **Real-time Information**: Inquire about current weather, date, time, or perform web searches for the latest news and information.

## 📚 How to Use

Once the application is running and you are logged in via Clerk, you can start interacting with AskGPT in the chat interface. Here are some examples of what you can ask:

*   **General Query:** 
