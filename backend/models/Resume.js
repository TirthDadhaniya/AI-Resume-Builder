const mongoose = require("mongoose");

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
);

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  major: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: "" },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  gpa: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "" },
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true, default: "" },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  descriptionPoints: [{ type: String, trim: true }],
  technologies: [{ type: String, trim: true }],
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, trim: true, default: "" },
  descriptionPoints: [{ type: String, trim: true }],
  technologies: [{ type: String, trim: true }],
});

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true }],
});

const resumeSchema = new mongoose.Schema(
  {
    templateId: { type: String, default: "default-template" },
    lastModified: { type: Date, default: Date.now },
    personalInfo: { type: personalInfoSchema, required: true },
    objective: { type: String, trim: true, default: "" },
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    skills: [skillCategorySchema],
    achievements: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
