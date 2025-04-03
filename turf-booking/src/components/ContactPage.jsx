// import { useState } from "react";
// import { Link } from "react-router-dom";

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });
//   const [formStatus, setFormStatus] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Form validation
//     if (!formData.name || !formData.email || !formData.message) {
//       setFormStatus({
//         type: "error",
//         message: "Please fill in all fields",
//       });
//       return;
//     }

//     // Form submission logic would go here
//     setFormStatus({
//       type: "success",
//       message: "Thanks for reaching out! We'll get back to you soon.",
//     });

//     // Reset form after successful submission
//     setFormData({
//       name: "",
//       email: "",
//       message: "",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center mb-12">
//           Contact <span className="text-green-600">Support</span>
//         </h1>

//         <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="grid grid-cols-1 lg:grid-cols-2">
//             <div className="p-8">
//               <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-gray-700 font-medium mb-2"
//                   >
//                     Your Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-gray-700 font-medium mb-2"
//                   >
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
//                     placeholder="john@example.com"
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="message"
//                     className="block text-gray-700 font-medium mb-2"
//                   >
//                     Your Message
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleInputChange}
//                     rows="5"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
//                     placeholder="How can we help you?"
//                   ></textarea>
//                 </div>

//                 {formStatus && (
//                   <div
//                     className={`p-4 rounded-lg ${
//                       formStatus.type === "success"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {formStatus.message}
//                   </div>
//                 )}

//                 <div>
//                   <button
//                     type="submit"
//                     className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full md:w-auto"
//                   >
//                     Send Message
//                   </button>
//                 </div>
//               </form>
//             </div>

//             <div className="bg-green-600 text-white p-8">
//               <h2 className="text-2xl font-semibold mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-6">
//                 <div className="flex items-start">
//                   <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
//                     📍
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Our Location</h4>
//                     <p className="text-green-100">
//                       123 Sports Avenue, Stadium District, City
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
//                     📱
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Phone Number</h4>
//                     <p className="text-green-100">+1 (555) 123-4567</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
//                     ✉️
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Email Address</h4>
//                     <p className="text-green-100">contact@sportsturf.com</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
//                     🕒
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Working Hours</h4>
//                     <p className="text-green-100">Monday - Friday: 9am - 6pm</p>
//                     <p className="text-green-100">Saturday: 10am - 4pm</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4">
//                 <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
//                 <div className="flex space-x-3">
//                   <SocialLink icon="facebook" />
//                   <SocialLink icon="twitter" />
//                   <SocialLink icon="instagram" />
//                   <SocialLink icon="linkedin" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="text-center mt-8">
//           <Link
//             to="/"
//             className="text-green-600 hover:text-green-800 font-semibold"
//           >
//             &larr; Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ContactPage = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState("general");

  // Form data with additional fields for different request types
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",

    // Trainer request fields
    experience: "",
    specialization: "",
    availability: "",

    // Manager application fields
    managementExperience: "",
    facilitiesManaged: "",

    // Grievance fields
    grievanceType: "",
    orderNumber: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  // Reset specific fields when tab changes
  useEffect(() => {
    setFormStatus(null);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    let requiredFields = ["name", "email"];

    // Add tab-specific required fields
    if (activeTab === "trainer") {
      requiredFields = [
        ...requiredFields,
        "experience",
        "specialization",
        "availability",
      ];
    } else if (activeTab === "manager") {
      requiredFields = [
        ...requiredFields,
        "managementExperience",
        "facilitiesManaged",
      ];
    } else if (activeTab === "grievance") {
      requiredFields = [...requiredFields, "grievanceType"];
    }

    // Check if required fields are filled
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setFormStatus({
        type: "error",
        message: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
      });
      return;
    }

    // Form submission logic would go here
    setFormStatus({
      type: "success",
      message: `Your ${getTabLabel(
        activeTab
      ).toLowerCase()} has been submitted successfully! We'll get back to you soon.`,
    });

    // Reset form after successful submission
    const resetData = { name: "", email: "", phone: "", message: "" };
    setFormData({
      ...formData,
      ...resetData,
    });
  };

  // Helper function to get tab label
  const getTabLabel = (tab) => {
    switch (tab) {
      case "general":
        return "General Inquiry";
      case "trainer":
        return "Trainer Application";
      case "manager":
        return "Manager Application";
      case "grievance":
        return "Grievance";
      default:
        return "Contact";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Contact <span className="text-green-600">Us</span>
        </h1>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8">
              {/* Tabs */}
              <div className="flex flex-wrap mb-8 border-b">
                {[
                  { id: "general", label: "General Inquiry" },
                  { id: "trainer", label: "Become a Trainer" },
                  { id: "manager", label: "Manager Application" },
                  { id: "grievance", label: "Report an Issue" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl font-semibold mb-6">
                {getTabLabel(activeTab)}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common fields for all tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Conditional fields based on active tab */}
                {activeTab === "trainer" && (
                  <>
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Years of Experience{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Select availability</option>
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Evenings">Evenings Only</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Resume (PDF)
                      </label>
                      <div className="relative border border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf"
                        />
                        <div className="text-gray-500">
                          <p className="mb-2">Drag and drop your resume here</p>
                          <p className="text-sm">or click to browse</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "manager" && (
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        placeholder="E.g., Community Center, Sports Club"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Upload Resume (PDF)
                      </label>
                      <div className="relative border border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf"
                        />
                        <div className="text-gray-500">
                          <p className="mb-2">Drag and drop your resume here</p>
                          <p className="text-sm">or click to browse</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "grievance" && (
                  <>
                    <div>
                      <label
                        htmlFor="grievanceType"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Type of Issue <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="grievanceType"
                        name="grievanceType"
                        value={formData.grievanceType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      >
                        <option value="">Select issue type</option>
                        <option value="Booking">Booking Problem</option>
                        <option value="Payment">Payment Issue</option>
                        <option value="Facility">Facility Condition</option>
                        <option value="Staff">Staff Behavior</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="orderNumber"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Booking/Order Number (if applicable)
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        placeholder="e.g., BK12345"
                      />
                    </div>
                  </>
                )}

                {/* Message field for all tabs */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Your Message{" "}
                    {activeTab !== "general" && (
                      <span className="text-gray-500">
                        (Additional Details)
                      </span>
                    )}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder={
                      activeTab === "general"
                        ? "How can we help you?"
                        : activeTab === "trainer"
                        ? "Tell us about your training style and why you'd be a great fit..."
                        : activeTab === "manager"
                        ? "Describe your management philosophy and relevant experience..."
                        : "Please provide details about your issue..."
                    }
                  ></textarea>
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

                <div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full md:w-auto"
                  >
                    {activeTab === "general"
                      ? "Send Message"
                      : activeTab === "trainer" || activeTab === "manager"
                      ? "Submit Application"
                      : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-green-600 text-white p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
                    📍
                  </div>
                  <div>
                    <h4 className="font-semibold">Our Location</h4>
                    <p className="text-green-100">
                      123 Sports Avenue, Stadium District, City
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
                    📱
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone Number</h4>
                    <p className="text-green-100">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Address</h4>
                    <p className="text-green-100">contact@sportsturf.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-xl mr-4">
                    🕒
                  </div>
                  <div>
                    <h4 className="font-semibold">Working Hours</h4>
                    <p className="text-green-100">Monday - Friday: 9am - 6pm</p>
                    <p className="text-green-100">Saturday: 10am - 4pm</p>
                  </div>
                </div>
              </div>

              {/* Conditional content based on active tab */}
              <div className="mt-12 pt-6 border-t border-green-500">
                {activeTab === "trainer" && (
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">
                      Trainer Program Benefits
                    </h4>
                    <ul className="list-disc pl-5 text-green-100 space-y-1">
                      <li>Flexible working hours</li>
                      <li>Competitive compensation</li>
                      <li>Access to premium facilities</li>
                      <li>Professional development opportunities</li>
                    </ul>
                  </div>
                )}

                {activeTab === "manager" && (
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">
                      Manager Role Overview
                    </h4>
                    <ul className="list-disc pl-5 text-green-100 space-y-1">
                      <li>Full facility management</li>
                      <li>Staff supervision and training</li>
                      <li>Customer service excellence</li>
                      <li>Operations optimization</li>
                    </ul>
                  </div>
                )}

                {activeTab === "grievance" && (
                  <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">
                      Our Resolution Promise
                    </h4>
                    <p className="text-green-100">
                      We take all issues seriously and aim to resolve them
                      within 48 hours. Your feedback helps us improve our
                      service.
                    </p>
                  </div>
                )}

                <h4 className="font-semibold mb-4 mt-6">Follow Us</h4>
                <div className="flex space-x-3">
                  <SocialLink icon="facebook" />
                  <SocialLink icon="twitter" />
                  <SocialLink icon="instagram" />
                  <SocialLink icon="linkedin" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-green-600 hover:text-green-800 font-semibold"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// Social media link component with branded hover effects
const SocialLink = ({ icon }) => {
  const getIcon = (type) => {
    switch (type) {
      case "facebook":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // Different hover colors for each social media platform
  const getHoverStyles = (type) => {
    switch (type) {
      case "facebook":
        return "hover:bg-blue-600";
      case "twitter":
        return "hover:bg-sky-500";
      case "instagram":
        return "hover:bg-pink-600";
      case "linkedin":
        return "hover:bg-blue-700";
      default:
        return "hover:bg-green-700";
    }
  };

  return (
    <a
      href="#"
      className={`w-10 h-10 bg-green-500 bg-opacity-30 rounded-full flex items-center justify-center text-white 
        hover:text-white transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300
        ${getHoverStyles(icon)}`}
    >
      {getIcon(icon)}
    </a>
  );
};

export default ContactPage;
