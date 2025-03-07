import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">TurfBook</h3>
            <p className="text-gray-300">
              Book your favorite sports turf easily and hassle-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/turfs"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Find Turfs
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Sports</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/turfs?sportTypes=Football"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Football
                </Link>
              </li>
              <li>
                <Link
                  to="/turfs?sportTypes=Cricket"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Cricket
                </Link>
              </li>
              <li>
                <Link
                  to="/turfs?sportTypes=Basketball"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Basketball
                </Link>
              </li>
              <li>
                <Link
                  to="/turfs?sportTypes=Tennis"
                  className="text-gray-300 hover:text-white transition duration-300"
                >
                  Tennis
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <i className="fas fa-map-marker-alt mr-2"></i>
                123 Sports Avenue, Sportsville
              </li>
              <li>
                <i className="fas fa-phone mr-2"></i>
                +1 234 567 8901
              </li>
              <li>
                <i className="fas fa-envelope mr-2"></i>
                info@turfbook.com
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; {currentYear} TurfBook. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition duration-300"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
