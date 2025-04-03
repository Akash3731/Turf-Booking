import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const CareerApplicationPage = () => {
  const { roleId } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    availability: "",
    resume: null,
    coverLetter: "",
    referralSource: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  // Role specific information
  const roleInfo = {
    trainer: {
      title: "Sports Trainer Application",
      fields: [
        "experience",
        "specialization",
        "availability",
        "certifications",
      ],
      requirements: [
        "Minimum 2 years of coaching/training experience",
        "Sports certifications in relevant fields",
        "Excellent communication and teaching skills",
        "Passion for sports and athletic development",
      ],
    },
    manager: {
      title: "Facility Manager Application",
      fields: ["managementExperience", "facilitiesManaged", "availability"],
      requirements: [
        "3+ years in facility or operations management",
        "Strong leadership and team management abilities",
        "Experience with scheduling and resource allocation",
        "Customer service excellence",
      ],
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic would go here

    // Form submission logic would go here
    setFormStatus({
      type: "success",
      message:
        "Your application has been submitted successfully! Our HR team will review your credentials and contact you soon.",
    });

    // Reset form after successful submission (in a real application)
    // setFormData({ ... });
  };

  // If role ID doesn't exist, show appropriate message
  if (!roleInfo[roleId]) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Position Not Found</h1>
          <p className="text-gray-600 mb-8">
            The position you're looking for doesn't exist or has been filled.
          </p>
          <Link
            to="/careers"
            className="text-green-600 hover:text-green-800 font-semibold"
          >
            ← Back to All Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/careers"
            className="text-green-600 hover:text-green-800 font-semibold inline-block mb-6"
          >
            ← Back to All Positions
          </Link>

          <h1 className="text-3xl font-bold mb-2">{roleInfo[roleId].title}</h1>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">
                Position Requirements
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-6">
                {roleInfo[roleId].requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Role specific fields */}
                {roleId === "trainer" && (
                  <>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Years of Training Experience{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Select experience</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="specialization"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Sports Specialization{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Select specialization</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Multiple">Multiple Sports</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="certifications"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Certifications <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="certifications"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        placeholder="E.g., CPR, Sports Nutrition, Strength Training"
                      />
                    </div>
                  </>
                )}

                {roleId === "manager" && (
                  <>
                    <div>
                      <label
                        htmlFor="managementExperience"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Management Experience{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="managementExperience"
                        name="managementExperience"
                        value={formData.managementExperience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Select experience</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="facilitiesManaged"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Previous Facilities Managed{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="facilitiesManaged"
                        name="facilitiesManaged"
                        value={formData.facilitiesManaged}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        placeholder="E.g., Community Center, Sports Club"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="teamSize"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Largest Team Size Managed{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Common fields for all roles */}
                <div>
                  <label
                    htmlFor="availability"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  >
                    <option value="">Select availability</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Weekends">Weekends only</option>
                    <option value="Evenings">Evenings only</option>
                    <option value="Flexible">Flexible hours</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="resume"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Resume <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      onChange={handleFileChange}
                      required
                      accept=".pdf,.doc,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        {formData.resume
                          ? formData.resume.name
                          : "Drag and drop your resume, or click to select"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, or DOCX up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="coverLetter"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="Tell us why you're interested in this position and what you bring to the table..."
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="referralSource"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    How did you hear about us?
                  </label>
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  >
                    <option value="">Select one</option>
                    <option value="job-board">Job Board</option>
                    <option value="company-website">Company Website</option>
                    <option value="referral">Referred by an Employee</option>
                    <option value="social-media">Social Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {formStatus && (
                  <div
                    className={`p-4 rounded-lg ${
                      formStatus.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {formStatus.message}
                  </div>
                )}

                <div className="flex items-center pt-4">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="consent"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I consent to having my data processed for recruitment
                    purposes <span className="text-red-500">*</span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full md:w-auto"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerApplicationPage;
