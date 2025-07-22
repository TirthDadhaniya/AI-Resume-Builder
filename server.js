// models/Resume.js (Mongoose Schema for the Resume data model)

const mongoose = require("mongoose");

// Define sub-schemas for nested documents to ensure data consistency and structure

// 1. Personal Information Schema
const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"],
    },
    phone: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    portfolio: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
  },
  { _id: false }
); // _id: false means Mongoose will not create an _id for this subdocument

// 2. Education Entry Schema
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  major: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: "" },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional if still attending
  gpa: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
});

// 3. Experience Entry Schema
const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: "" },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional if current job
  descriptionPoints: [{ type: String, trim: true }], // Array of bullet points
  technologies: [{ type: String, trim: true }], // Array of technologies used
});

// 4. Project Entry Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, trim: true, default: "" },
  descriptionPoints: [{ type: String, trim: true }],
  technologies: [{ type: String, trim: true }],
});

// 5. Skill Category Schema
const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true }, // e.g., 'Programming Languages', 'Frameworks'
  skills: [{ type: String, trim: true }], // Array of individual skills, e.g., ['JavaScript', 'Python']
});

// Main Resume Schema
const resumeSchema = new mongoose.Schema(
  {
    // Link to a user if authentication is implemented (optional for this project scope)
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    templateId: { type: String, default: "default-template" }, // To support different resume templates
    lastModified: { type: Date, default: Date.now },

    personalInfo: { type: personalInfoSchema, required: true },
    objective: { type: String, trim: true, default: "" }, // Professional summary/objective

    education: [educationSchema], // Array of education entries
    experience: [experienceSchema], // Array of experience entries
    projects: [projectSchema], // Array of project entries
    skills: [skillCategorySchema], // Array of skill categories
    achievements: [{ type: String, trim: true }], // Optional: Any awards or achievements
    certifications: [{ type: String, trim: true }], // Optional: Any certifications
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Create and export the main Resume model
module.exports = mongoose.model("Resume", resumeSchema);
