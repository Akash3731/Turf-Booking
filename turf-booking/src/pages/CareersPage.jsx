import { useState } from "react";
import { Link } from "react-router-dom";

const CareersPage = () => {
  const [activeRole, setActiveRole] = useState(null);

  const roles = [
    {
      id: "trainer",
      title: "Sports Trainer",
      description:
        "Join our team of professional trainers to help athletes reach their full potential.",
      requirements: [
        "Minimum 2 years of coaching/training experience",
        "Sports certifications in relevant fields",
        "Excellent communication and teaching skills",
        "Passion for sports and athletic development",
      ],
      benefits: [
        "Flexible working hours",
        "Competitive compensation",
        "Access to premium facilities",
        "Professional development opportunities",
      ],
    },
    {
      id: "manager",
      title: "Facility Manager",
      description:
        "Lead operations at our state-of-the-art sports facilities and ensure an exceptional experience for all users.",
      requirements: [
        "3+ years in facility or operations management",
        "Strong leadership and team management abilities",
        "Experience with scheduling and resource allocation",
        "Customer service excellence",
      ],
      benefits: [
        "Competitive salary package",
        "Health and wellness benefits",
        "Career advancement opportunities",
        "Sports industry networking",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-6">
          Join Our <span className="text-green-600">Team</span>
        </h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
          We're looking for passionate individuals to help us deliver
          exceptional sports experiences. Explore our current openings and
          become part of our community.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {role.title}
                </h2>
                <p className="text-gray-600 mb-6">{role.description}</p>

                <button
                  onClick={() =>
                    setActiveRole(activeRole === role.id ? null : role.id)
                  }
                  className="text-green-600 hover:text-green-800 font-medium flex items-center"
                >
                  {activeRole === role.id ? "Hide Details" : "View Details"}
                  <svg
                    className={`w-5 h-5 ml-1 transition-transform duration-200 ${
                      activeRole === role.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {activeRole === role.id && (
                  <div className="mt-6 space-y-6 animate-fadeIn">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Requirements
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {role.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Benefits
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {role.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={`/careers/apply/${role.id}`}
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-4"
                    >
                      Apply Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Application Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Submit Application</h3>
              <p className="text-gray-600">
                Complete our online application form with your credentials and
                experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Interview</h3>
              <p className="text-gray-600">
                Selected candidates will be invited for an in-person or virtual
                interview.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Onboarding</h3>
              <p className="text-gray-600">
                Successful applicants will receive training and orientation
                before starting.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Don't see a position that matches your skills?
          </p>
          <Link
            to="/contact"
            className="text-green-600 hover:text-green-800 font-semibold"
          >
            Contact us to discuss opportunities →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
