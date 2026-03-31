# Smart AI Interview Board

Smart AI Interview Board is an AI-powered recruitment platform that helps automate interview processes using artificial intelligence.

The system allows organizations to manage candidates, experts, interviews, and feedback while leveraging AI to analyze resumes and generate interview questions.

---

## Features

- AI-powered resume analysis
- Automatic interview question generation
- Candidate and expert management
- Job posting and application system
- Interview scheduling and management
- Real-time chat between candidate and expert
- Feedback and evaluation system
- Secure authentication using JWT

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### AI Integration
- Groq API
- Gemini API

### Tools
- REST API
- Mongoose

---

## Project Structure

Interview-app

server
models
routes
services
utils
server.js

package.json  
README.md

---

## Installation

Clone the repository

git clone https://github.com/Vijaysriv05/Smart-AI-Interview-Board.git

Go to the project folder

cd Smart-AI-Interview-Board

Install dependencies

npm install

---

## Environment Variables

Create a `.env` file inside the server folder.

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
GEMINI_API_KEY=your_key  
GROQ_API_KEY=your_key  

---

## Run the Project

Start the server

node server.js

Server will run on

http://localhost:3000

---

## Future Improvements

- Video interview integration
- AI candidate scoring
- Admin dashboard
- Interview analytics

---

## Author

Vijay Sri V

GitHub  
https://github.com/Vijaysriv05
