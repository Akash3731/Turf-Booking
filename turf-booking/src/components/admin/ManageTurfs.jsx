import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import TurfForm from "../../components/admin/TurfForm";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const ManageTurfs = () => {
  const { authAxios } = useContext(AuthContext);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSport, setFilterSport] = useState("");

  // Fetch turfs based on current filters and pagination
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);

        let queryString = `?page=${currentPage}&limit=10`;

        if (searchQuery) {
          queryString += `&name=${searchQuery}`;
        }

        if (filterSport) {
          queryString += `&sportTypes=${filterSport}`;
        }

        const response = await authAxios.get(`/api/turfs${queryString}`);

        setTurfs(response.data.data);

        if (response.data.pagination) {
          setTotalPages(
            Math.ceil(
              response.data.pagination.total / response.data.pagination.limit
            )
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching turfs:", error);
        setError("Failed to load turfs");
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [authAxios, currentPage, searchQuery, filterSport]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sport filter change
  const handleSportFilterChange = (e) => {
    setFilterSport(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle turf deletion
  const handleDeleteTurf = async (id) => {
    if (window.confirm("Are you sure you want to delete this turf?")) {
      try {
        await authAxios.delete(`/api/turfs/${id}`);

        // Remove deleted turf from state
        setTurfs(turfs.filter((turf) => turf._id !== id));
      } catch (error) {
        console.error("Error deleting turf:", error);
        alert("Failed to delete turf");
      }
    }
  };

  // Handle form submission success
  const handleFormSuccess = (turf) => {
    if (editingTurf) {
      // Update existing turf in the list
      setTurfs(turfs.map((item) => (item._id === turf._id ? turf : item)));
    } else {
      // Add new turf to the list
      setTurfs([turf, ...turfs]);
    }

    // Close the form
    setShowForm(false);
    setEditingTurf(null);
  };

  // Handle add/edit button clicks
  const handleAddClick = () => {
    setEditingTurf(null);
    setShowForm(true);
  };

  const handleEditClick = (turf) => {
    setEditingTurf(turf);
    setShowForm(true);
  };

  if (loading && turfs.length === 0) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Turfs</h1>

        <button
          onClick={handleAddClick}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Add New Turf
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Show form for adding/editing */}
      {showForm && (
        <div className="mb-8">
          <TurfForm turf={editingTurf} onSubmitSuccess={handleFormSuccess} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Turfs
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="sportFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Sport
            </label>
            <select
              id="sportFilter"
              value={filterSport}
              onChange={handleSportFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Sports</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Basketball">Basketball</option>
              <option value="Tennis">Tennis</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Turfs Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Hour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sports
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
              {turfs.length > 0 ? (
                turfs.map((turf) => (
                  <tr key={turf._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              turf.images && turf.images.length > 0
                                ? `${API_URL}${turf.images[0]}`
                                : "https://via.placeholder.com/100"
                            }
                            alt={turf.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {turf.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{turf.city}</div>
                      <div className="text-sm text-gray-500">
                        {turf.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${turf.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {turf.sportTypes.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          turf.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {turf.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(turf)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTurf(turf._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No turfs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTurfs;
