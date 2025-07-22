import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const API_URL = "http://localhost:5000/api/resumes";
const SUGGESTION_API = "http://localhost:5000/api/suggestions";

function App() {
  const [resume, setResume] = useState({
    name: "",
    email: "",
    skills: "",
    experienceCompany: "",
    experiencePosition: "",
    educationInstitution: "",
    educationDegree: "",
    educationYear: "",
  });

  const [savedResumes, setSavedResumes] = useState([]);
  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  const componentRef = useRef();

  // Fetch all saved resumes
  const fetchResumes = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSavedResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  // Save a new resume
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: resume.name,
      email: resume.email,
      skills: resume.skills
        ? resume.skills.split(",").map((skill) => skill.trim())
        : [],
      experience:
        resume.experienceCompany && resume.experiencePosition
          ? [
              {
                company: resume.experienceCompany,
                position: resume.experiencePosition,
              },
            ]
          : [],
      education:
        resume.educationInstitution &&
        resume.educationDegree &&
        resume.educationYear
          ? [
              {
                institution: resume.educationInstitution,
                degree: resume.educationDegree,
                year: resume.educationYear,
              },
            ]
          : [],
    };
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      fetchResumes();
      setResume({
        name: "",
        email: "",
        skills: "",
        experienceCompany: "",
        experiencePosition: "",
        educationInstitution: "",
        educationDegree: "",
        educationYear: "",
      });
    } catch (error) {
      console.error("Error saving resume:", error);
    }
  };

  // Get AI suggestions
  const handleSuggest = async () => {
    setLoadingSuggestions(true);
    setSuggestions("");
    setSuggestionError("");
    const payload = {
      name: resume.name,
      email: resume.email,
      skills: resume.skills
        ? resume.skills.split(",").map((skill) => skill.trim())
        : [],
      experience:
        resume.experienceCompany && resume.experiencePosition
          ? [
              {
                company: resume.experienceCompany,
                position: resume.experiencePosition,
              },
            ]
          : [],
      education:
        resume.educationInstitution &&
        resume.educationDegree &&
        resume.educationYear
          ? [
              {
                institution: resume.educationInstitution,
                degree: resume.educationDegree,
                year: resume.educationYear,
              },
            ]
          : [],
    };
    try {
      const res = await fetch(SUGGESTION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      setSuggestionError(error.message || "Failed to fetch suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Export resume and suggestions as PDF
  const exportPdf = async () => {
    const input = componentRef.current;
    if (!input) {
      console.error("No element to print! Make sure componentRef is attached.");
      return;
    }
    const noPrintElements = document.querySelectorAll(".no-print");
    noPrintElements.forEach((el) => (el.style.display = "none"));
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`${resume.name || "resume"}_suggestions.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      noPrintElements.forEach((el) => (el.style.display = ""));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-8 my-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6 tracking-tight">
          Smart Resume Builder ✨
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {[
            { name: "name", placeholder: "Your Full Name", value: resume.name },
            {
              name: "email",
              placeholder: "Email Address",
              value: resume.email,
            },
            {
              name: "skills",
              placeholder: "Skills (comma separated)",
              value: resume.skills,
            },
            {
              name: "experienceCompany",
              placeholder: "Experience - Company",
              value: resume.experienceCompany,
            },
            {
              name: "experiencePosition",
              placeholder: "Experience - Position",
              value: resume.experiencePosition,
            },
            {
              name: "educationInstitution",
              placeholder: "Education - Institution",
              value: resume.educationInstitution,
            },
            {
              name: "educationDegree",
              placeholder: "Education - Degree",
              value: resume.educationDegree,
            },
            {
              name: "educationYear",
              placeholder: "Education - Year",
              value: resume.educationYear,
            },
          ].map((field, index) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={field.value}
              onChange={handleChange}
              required={index < 3}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200"
          >
            💾 Save Resume
          </button>
        </form>
        <div className="flex flex-wrap gap-4 mt-6 justify-center no-print">
          <button
            onClick={fetchResumes}
            className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
          >
            📂 Load Resumes
          </button>
          <button
            onClick={handleSuggest}
            className="flex-1 min-w-[150px] bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
            disabled={loadingSuggestions}
          >
            {loadingSuggestions ? "Loading..." : "🤖 Get AI Suggestions"}
          </button>
          <button
            onClick={exportPdf}
            className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
          >
            📄 Export to PDF
          </button>
        </div>
        {suggestionError && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Error:</h2>
            <p>{suggestionError}</p>
          </div>
        )}
        {suggestions && (
          <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded shadow">
            <h2 className="text-lg font-bold mb-2">💡 AI Suggestions</h2>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {suggestions}
            </pre>
          </div>
        )}
      </div>
      <div
        ref={componentRef}
        className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-8 mt-8 printable-content"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
          {resume.name || "Your Resume Preview"}
        </h2>
        {resume.name && resume.email && (
          <div className="mb-4 text-center">
            <p className="text-lg text-gray-700">{resume.email}</p>
          </div>
        )}
        {resume.skills && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2 border-b border-gray-200 pb-1">
              Skills
            </h3>
            <p className="text-gray-700">{resume.skills}</p>
          </div>
        )}
        {resume.experienceCompany && resume.experiencePosition && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-indigo-700 mb-2 border-b border-gray-200 pb-1">
              Experience
            </h3>
            <p className="text-gray-700">
              <strong>{resume.experiencePosition}</strong> at{" "}
              {resume.experienceCompany}
            </p>
          </div>
        )}
        {resume.educationInstitution &&
          resume.educationDegree &&
          resume.educationYear && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2 border-b border-gray-200 pb-1">
                Education
              </h3>
              <p className="text-gray-700">
                <strong>{resume.educationDegree}</strong> from{" "}
                {resume.educationInstitution} ({resume.educationYear})
              </p>
            </div>
          )}
        {suggestions && !suggestionError && (
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-300 text-yellow-800 rounded shadow print-suggestions">
            <h3 className="text-lg font-bold mb-2">💡 AI Suggestions</h3>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {suggestions}
            </pre>
          </div>
        )}
      </div>
      {savedResumes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            📋 Saved Resumes
          </h2>
          <ul className="space-y-6">
            {savedResumes.map((res, index) => (
              <li
                key={res._id || index}
                className="p-6 bg-gray-50 rounded-lg shadow border"
              >
                <h3 className="text-xl font-semibold text-indigo-700">
                  {res.name}
                </h3>
                <p className="text-gray-600">📧 {res.email}</p>
                <p className="text-gray-600">
                  🛠 Skills: {res.skills.join(", ")}
                </p>
                {res.experience && res.experience.length > 0 && (
                  <p className="text-gray-600">
                    💼 {res.experience[0].company} -{" "}
                    {res.experience[0].position}
                  </p>
                )}
                {res.education && res.education.length > 0 && (
                  <p className="text-gray-600">
                    🎓 {res.education[0].degree} from{" "}
                    {res.education[0].institution} ({res.education[0].year})
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
