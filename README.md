🧩 Maze Puzzle Game
📖 Overview

This is an interactive Maze Puzzle Game featuring 3 difficulty levels.
The goal is simple yet challenging:

Navigate your student player through the maze using the directions + steps interface (via dropdown menus).

Collect keys to unlock doors that reveal hidden Books of Knowledge.

Gather all 5 books to win the game! 🎉

Along the way, you’ll see:

🏆 A Leaderboard

📜 A History of your moves

🔑 A Key tracker

📚 A Book collection tracker

✨ Signing up is quick—no email verification needed, just log in and play!

🛠 My Approach

I aimed to build this project quickly by leveraging AI for speed and efficiency.

Frontend Development

Started with how the maze should be designed and displayed.

Implemented movement for the student emoji character using direction + step commands.

Added game assets: keys, books, doors, portals, and walls.

Integrated animations for visual appeal.

Created frontend endpoints for player interactions.

Backend Development

Designed a FastAPI backend to handle:

User authentication (sign up & login with JWT).

Move validation (checking if a player reaches the goal).

Database (Supabase + PostgreSQL) stores:

Users

Maze puzzles

Player attempts, moves, keys, and collected books

Mazes are generated and stored on the server side.

🤖 AI Assistance

AI was instrumental in:

Writing code comments for clarity

Speeding up Jest test creation

Debugging console errors

Generating SQL scripts for Supabase

Implementing a Prim’s Maze Algorithm for maze generation

Helping with complex game logic

Providing references for FastAPI methods & JWT authentication setup

Assisting with component completion & optimization

⚙️ Tech Stack
Frontend

React.js

JavaScript

TailwindCSS

Framer Motion (animations)

Backend

FastAPI (Python)

Supabase + PostgreSQL (Database)