# 💼 Smart Resume Builder with AI Suggestions

A full-stack web application to help users build professional resumes, receive real-time AI suggestions for improvements, and export resumes as PDFs — all in one place.

---

## 🚀 Features

- 📝 Dynamic Resume Form (React)
- 🤖 AI Suggestions (OpenAI API, mocked for demo)
- 📦 Backend with Node.js & Express
- 🗃️ MongoDB integration for persistent storage
- 🖨️ Export resume + AI suggestions to PDF (html2canvas, jsPDF)
- 🎨 Responsive UI with Tailwind CSS
- 🔐 Modern, minimal, and easy-to-use design

---

## 🧰 Tech Stack

| Frontend | Backend           | AI API          | Styling      | Database |
| -------- | ----------------- | --------------- | ------------ | -------- |
| React.js | Node.js + Express | OpenAI (mocked) | Tailwind CSS | MongoDB  |

---

## 📁 Project Structure

```
Resume-Builder/
├── backend/           # Node.js + Express backend
│   ├── server.js      # Main backend server
│   ├── models/        # Mongoose models
│   │   └── Resume.js
│   ├── fixed-connection.js  # (MongoDB connection test)
│   ├── test-connection.js   # (MongoDB connection test)
│   ├── test-string.js       # (empty/test file)
│   ├── package.json
│   └── package-lock.json
│
├── client/            # React.js frontend
│   ├── src/
│   │   ├── App.js     # Main app logic
│   │   ├── App.css
│   │   ├── App.test.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── logo.svg
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── package-lock.json
│
├── README.md          # Project documentation
└── ...
```

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repo-url>
cd Resume-Builder
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in the `backend` directory with the following:

```
MONGODB_URI="<your-mongodb-uri>"
OPENAI_API_KEY="<your-openai-api-key>"  # Not required for demo/mock
```

- Start the backend server:

```bash
node server.js
```

- The backend runs on [http://localhost:5000](http://localhost:5000)

### 3️⃣ Frontend Setup

```bash
cd ../client
npm install
npm start
```

- The frontend runs on [http://localhost:3000](http://localhost:3000)

---

## 💡 How AI Suggestions Work

- Resume data is sent to the backend endpoint `/api/suggestions`.
- The backend (currently mocked) returns AI-powered suggestions for resume improvement.
- Suggestions are displayed in the UI and included in the exported PDF.

---

## 🖨️ Export as PDF

- The entire resume, including AI suggestions, can be exported using:
  - `html2canvas` for DOM capture
  - `jsPDF` for generating a downloadable PDF

---

## 📝 Environment Variables

- **MONGODB_URI**: Your MongoDB connection string (local or Atlas)
- **OPENAI_API_KEY**: Your OpenAI API key (not required for demo/mock)

---

## 📸 Screenshots

<img width="1889" height="892" alt="Screenshot (16)" src="https://github.com/user-attachments/assets/536c3e9f-ec46-4cba-869c-15981f514b99" />
<img width="1892" height="893" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/623b4041-90d3-47e8-89e2-f5fa5f71d2ed" />
<img width="1896" height="623" alt="Screenshot (18)" src="https://github.com/user-attachments/assets/0b64086b-9cb6-4a6a-9990-c4ae946000de" />
<img width="1897" height="518" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/c26fa429-7321-4c97-ad8e-87f36f03b56b" />
<img width="1894" height="343" alt="Screenshot (20)" src="https://github.com/user-attachments/assets/9599b046-b29d-4981-8976-54c01d419963" />

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---
