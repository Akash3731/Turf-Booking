import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Simulate subscription - in a real app, you'd call an API here
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-20 pb-8 mt-auto relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-500 rounded-full opacity-5 -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-green-500 rounded-full opacity-5 translate-x-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">T</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                TurfBook
                <span className="text-green-500">.</span>
              </span>
            </div>

            <p className="text-gray-300 max-w-md">
              Book your favorite sports turf easily and hassle-free. Join
              thousands of players who trust TurfBook for their sports facility
              needs.
            </p>

            <div className="pt-4">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                <SocialLink icon="facebook" />
                <SocialLink icon="twitter" />
                <SocialLink icon="instagram" />
                <SocialLink icon="linkedin" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-block w-8 h-px bg-green-500 mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/turfs">Find Turfs</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Sports */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-block w-8 h-px bg-green-500 mr-3"></span>
              Sports
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/turfs?sportTypes=Football">Football</FooterLink>
              <FooterLink to="/turfs?sportTypes=Cricket">Cricket</FooterLink>
              <FooterLink to="/turfs?sportTypes=Basketball">
                Basketball
              </FooterLink>
              <FooterLink to="/turfs?sportTypes=Tennis">Tennis</FooterLink>
              <FooterLink to="/turfs?sportTypes=Badminton">
                Badminton
              </FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-block w-8 h-px bg-green-500 mr-3"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 flex-shrink-0 bg-green-600/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Our Location</h4>
                  <p className="text-gray-400 text-sm">
                    123 Sports Avenue, Sportsville
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 flex-shrink-0 bg-green-600/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Phone Number</h4>
                  <p className="text-gray-400 text-sm">+1 234 567 8901</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 flex-shrink-0 bg-green-600/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">Email Address</h4>
                  <p className="text-gray-400 text-sm">info@turfbook.com</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="inline-block w-8 h-px bg-green-500 mr-3"></span>
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to get the latest updates and news about sports events.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className={`mt-3 w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  subscribed
                    ? "bg-green-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={subscribed}
              >
                {subscribed ? "Thanks for subscribing!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} TurfBook. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer link component
const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
    >
      <span className="w-0 h-0.5 bg-green-500 mr-0 opacity-0 group-hover:w-3 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300"></span>
      {children}
    </Link>
  </li>
);

// Social media link component
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

  return (
    <a
      href="#"
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
    >
      {getIcon(icon)}
    </a>
  );
};

export default Footer;
