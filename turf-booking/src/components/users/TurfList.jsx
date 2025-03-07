import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import TurfCard from "./TurfCard";
import Loader from "../../common/Loader";
import { API_URL } from "../../utils/constants";

const TurfList = () => {
  const { authAxios } = useContext(AuthContext);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // City and sport options (would ideally come from API)
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const sportTypes = ["Football", "Cricket", "Basketball", "Tennis", "Other"];

  // Fetch turfs based on current filters and pagination
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);

        let queryString = `?page=${currentPage}&limit=8`;

        if (searchQuery) {
          queryString += `&name=${searchQuery}`;
        }

        if (cityFilter) {
          queryString += `&city=${cityFilter}`;
        }

        if (sportFilter) {
          queryString += `&sportTypes=${sportFilter}`;
        }

        if (priceRange.min) {
          queryString += `&price[gte]=${priceRange.min}`;
        }

        if (priceRange.max) {
          queryString += `&price[lte]=${priceRange.max}`;
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
  }, [
    authAxios,
    currentPage,
    searchQuery,
    cityFilter,
    sportFilter,
    priceRange,
  ]);

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter changes
  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSportFilterChange = (e) => {
    setSportFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (e, type) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter("");
    setSportFilter("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  if (loading && turfs.length === 0) return <Loader />;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Find Sports Turfs</h1>

      {/* Filters Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
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

          {/* City Filter */}
          <div>
            <label
              htmlFor="cityFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <select
              id="cityFilter"
              value={cityFilter}
              onChange={handleCityFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sport Filter */}
          <div>
            <label
              htmlFor="sportFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sport
            </label>
            <select
              id="sportFilter"
              value={sportFilter}
              onChange={handleSportFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Sports</option>
              {sportTypes.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Turf Listings */}
      {turfs.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No turfs found</h2>
          <p className="text-gray-600">
            Try adjusting your filters to find more results.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {turfs.map((turf) => (
            <TurfCard key={turf._id} turf={turf} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Display page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border border-gray-300 ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } text-sm font-medium ${page === 1 ? "rounded-l-md" : ""} ${
                  page === totalPages ? "rounded-r-md" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurfList;
