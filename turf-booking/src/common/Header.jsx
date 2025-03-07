import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close dropdown if mobile menu is toggled
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            TurfBook
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-green-200 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/turfs"
              className="hover:text-green-200 transition duration-300"
            >
              Find Turfs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-green-200 transition duration-300"
                >
                  My Bookings
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:text-green-200 transition duration-300"
                  >
                    Admin
                  </Link>
                )}

                {/* User profile with separate profile and logout buttons */}
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition duration-300"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      <span>{user?.name}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
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

                    {/* Dropdown menu - now controlled by click */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-green-200 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block hover:text-green-200 transition duration-300"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/turfs"
              className="block hover:text-green-200 transition duration-300"
              onClick={toggleMobileMenu}
            >
              Find Turfs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block hover:text-green-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  My Bookings
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block hover:text-green-200 transition duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Admin
                  </Link>
                )}

                <div className="py-2 border-t border-green-600">
                  <p className="text-sm text-green-200 mb-2">
                    Signed in as:{" "}
                    <span className="font-bold">{user?.name}</span>
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 bg-green-600 rounded-md hover:bg-green-500"
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      className="block w-full text-left px-3 py-2 bg-red-600 rounded-md hover:bg-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-green-200 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-green-700 px-4 py-2 rounded-md hover:bg-green-100 transition duration-300"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
