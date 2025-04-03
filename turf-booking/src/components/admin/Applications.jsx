import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../common/Loader";

const AdminApplications = () => {
  const { authAxios, token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [onboardingSuccess, setOnboardingSuccess] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: filter === "all" ? null : filter,
            page: currentPage,
            limit: 10,
          },
        };

        const response = await authAxios.get("/api/applications/admin", config);

        setApplications(response.data.data || []);

        if (response.data.pagination) {
          setTotalPages(Math.ceil(response.data.pagination.total / 10));
        }

        setLoading(false);
      } catch (error) {
        console.error("===== APPLICATION FETCH ERROR =====");
        console.error("Error object:", error);

        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Error request (no response):", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        console.error("Error config:", error.config);

        setError(
          error.response?.data?.message ||
            "Failed to load applications. Please try again."
        );
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token, filter, currentPage]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      console.log(
        `Starting status update for application ${applicationId} to ${newStatus}...`
      );

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Sending status update request with config:", config);

      // Make API request to update status
      const response = await authAxios.put(
        `/api/applications/${applicationId}/status`,
        { status: newStatus },
        config
      );

      console.log("Status update response received:", response.data);

      // Update local state for the application list
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // If we're updating the currently selected application
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication((prev) => ({
          ...prev,
          status: newStatus,
        }));
      }

      // If accepting and the backend created a user account, show success message
      if (newStatus === "accepted" && response.data.userAccount) {
        console.log("ONBOARDING SUCCESS:", response.data.userAccount);
        console.log("User email:", response.data.userAccount.email);
        console.log("User role:", response.data.userAccount.role);
        console.log("New account created:", response.data.userAccount.created);

        setOnboardingSuccess({
          email: response.data.userAccount.email,
          role: response.data.userAccount.role,
          isNew: response.data.userAccount.created,
        });
      } else {
        console.log(`Status updated to ${newStatus}, no onboarding performed`);
        setOnboardingSuccess(null);
      }

      setStatusUpdateLoading(false);
    } catch (error) {
      console.error("===== ERROR UPDATING APPLICATION STATUS =====");
      console.error("Error object:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("Error request (no response):", error.request);
      } else {
        console.error("Error message:", error.message);
      }

      setError("Failed to update application status");
      setStatusUpdateLoading(false);
    }
  };

  const downloadCertification = (application) => {
    console.log("Application being used:", application);

    if (!application) {
      console.error("Application is undefined");
      return;
    }

    // Check both possible field names
    const certPath = application.resumePath || application.certificationPath;

    console.log("Certificate path extracted:", certPath);

    if (!certPath) {
      console.error("No valid path found");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const formattedPath = certPath.startsWith("/") ? certPath : `/${certPath}`;
    const fullUrl = `${apiUrl}${formattedPath}`;

    console.log("Full URL:", fullUrl);
    window.open(fullUrl, "_blank");
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
    setOnboardingSuccess(null); // Reset onboarding message when viewing a new application
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
    setOnboardingSuccess(null);
  };

  const renderOnboardingSuccessMessage = () => {
    if (!onboardingSuccess) return null;

    return (
      <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline">
          {" "}
          {onboardingSuccess.isNew
            ? `New ${onboardingSuccess.role} account created`
            : `Existing user updated with ${onboardingSuccess.role} role`}
        </span>
        <p className="mt-1">
          Login credentials have been sent to {onboardingSuccess.email}
        </p>
      </div>
    );
  };

  if (loading && applications.length === 0) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Applications</h1>

        <div className="flex items-center space-x-4">
          <label className="text-gray-700">Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length > 0 ? (
                applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.firstName} {application.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.turf?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : application.status === "reviewed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => downloadCertification(application)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Certification
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Application Details
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Show onboarding success message if present */}
            {renderOnboardingSuccessMessage()}

            <div className="max-h-[70vh] overflow-y-auto">
              {/* Basic Info Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    Basic Information
                  </h4>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      selectedApplication.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : selectedApplication.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : selectedApplication.status === "reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Full Name</span>
                    <span className="text-md font-medium">
                      {selectedApplication.firstName}{" "}
                      {selectedApplication.lastName}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-md font-medium">
                      {selectedApplication.email}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-md font-medium">
                      {selectedApplication.phone}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-md font-medium capitalize">
                      {selectedApplication.role}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">City</span>
                    <span className="text-md font-medium">
                      {selectedApplication.city}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Turf</span>
                    <span className="text-md font-medium">
                      {selectedApplication.turf?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Availability</span>
                    <span className="text-md font-medium">
                      {selectedApplication.availability}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Applied On</span>
                    <span className="text-md font-medium">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role-specific information */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  {selectedApplication.role === "trainer"
                    ? "Trainer"
                    : "Manager"}{" "}
                  Details
                </h4>

                <div className="bg-gray-50 p-4 rounded-md">
                  {selectedApplication.role === "trainer" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Experience
                        </span>
                        <span className="text-md font-medium">
                          {selectedApplication.experience || "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Specialization
                        </span>
                        <span className="text-md font-medium">
                          {selectedApplication.specialization ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-sm text-gray-500">
                          Certifications
                        </span>
                        <span className="text-md font-medium">
                          {selectedApplication.certifications || "None"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          Management Experience
                        </span>
                        <span className="text-md font-medium">
                          {selectedApplication.managementExperience ||
                            "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Team Size</span>
                        <span className="text-md font-medium">
                          {selectedApplication.teamSize
                            ? `${selectedApplication.teamSize} people`
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-sm text-gray-500">
                          Facilities Managed
                        </span>
                        <span className="text-md font-medium">
                          {selectedApplication.facilitiesManaged ||
                            "None specified"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Cover Letter
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-md whitespace-pre-line">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Additional Information
                </h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Referral Source
                      </span>
                      <span className="text-md font-medium">
                        {selectedApplication.referralSource || "Not specified"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Certification
                      </span>
                      <button
                        onClick={() =>
                          downloadCertification(selectedApplication)
                        }
                        className="text-blue-600 hover:text-blue-800 underline text-left"
                      >
                        Download Certification
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t pt-4 flex justify-between">
                <div>
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedApplication._id, "reviewed")
                    }
                    disabled={
                      statusUpdateLoading ||
                      selectedApplication.status === "reviewed"
                    }
                    className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2 ${
                      statusUpdateLoading ||
                      selectedApplication.status === "reviewed"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {statusUpdateLoading ? "Processing..." : "Mark as Reviewed"}
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication._id, "accepted");
                    }}
                    disabled={
                      statusUpdateLoading ||
                      selectedApplication.status === "accepted"
                    }
                    className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2 ${
                      statusUpdateLoading ||
                      selectedApplication.status === "accepted"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {statusUpdateLoading
                      ? "Processing..."
                      : selectedApplication.status === "accepted"
                      ? "Already Accepted"
                      : "Accept & Onboard"}
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApplication._id, "rejected");
                    }}
                    disabled={
                      statusUpdateLoading ||
                      selectedApplication.status === "rejected"
                    }
                    className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ${
                      statusUpdateLoading ||
                      selectedApplication.status === "rejected"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {statusUpdateLoading
                      ? "Processing..."
                      : selectedApplication.status === "rejected"
                      ? "Already Rejected"
                      : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
