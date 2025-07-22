require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Resume schema
const resumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: [String],
    experience: [
      {
        company: String,
        position: String,
        duration: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    summary: String,
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

// API Routes

// Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const resumes = await Resume.find({});
    res.json(resumes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching resumes", error: err.message });
  }
});

// Create a new resume
app.post("/api/resumes", async (req, res) => {
  const { name, email, skills, experience, education, summary } = req.body;
  try {
    const newResume = new Resume({
      name,
      email,
      skills,
      experience,
      education,
      summary,
    });
    await newResume.save();
    res.status(201).json(newResume);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving resume", error: err.message });
  }
});

// Update a resume by ID
app.put("/api/resumes/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, skills, experience, education, summary } = req.body;
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { name, email, skills, experience, education, summary },
      { new: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(updatedResume);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating resume", error: err.message });
  }
});

// Delete a resume by ID
app.delete("/api/resumes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting resume", error: err.message });
  }
});

// Mocked AI suggestions endpoint
app.post("/api/suggestions", async (req, res) => {
  const { name, skills, experience, education } = req.body;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  let mockSuggestions = [
    "Consider adding specific achievements and quantifiable results to your experience descriptions.",
    "Elaborate on your key skills with examples of how you applied them.",
    "Tailor your resume to the specific job description you're applying for by using relevant keywords.",
    "Ensure consistent formatting throughout the resume, especially for dates and bullet points.",
    "Add a brief professional summary at the top to highlight your value proposition.",
  ];

  if (skills && skills.length > 0) {
    mockSuggestions.unshift(
      `Highlight your proficiency in ${skills[0]} with a project example.`
    );
  }
  if (experience && experience.length > 0 && experience[0].company) {
    mockSuggestions.unshift(
      `For ${experience[0].company}, quantify your impact (e.g., "Increased sales by 15%").`
    );
  }
  if (!name || !skills || !experience || !education) {
    mockSuggestions.push(
      "Please fill in all resume sections for more tailored suggestions!"
    );
  }

  const suggestionsText = mockSuggestions.join("\n- ");
  res.json({ suggestions: suggestionsText });
});

app.listen(PORT, () => {
  console.log(`Node.js backend server listening on port ${PORT}`);
});
