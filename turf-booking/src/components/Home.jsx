import { Link } from "react-router-dom";
import { SPORT_TYPES } from "../utils/constants";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Sports Turfs with Ease
            </h1>
            <p className="text-xl mb-8">
              Find and book the perfect sports turf for your game. No hassle, no
              waiting. Just play.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/turfs"
                className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-colors"
              >
                Find a Turf
              </Link>
              <Link
                to="/register"
                className="bg-transparent hover:bg-green-700 border-2 border-white px-6 py-3 rounded-md font-semibold transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract shape decoration */}
        <div className="absolute right-0 bottom-0 opacity-20">
          <svg
            width="400"
            height="400"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFFFFF"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,89.9,-16.3,88.6,-0.8C87.3,14.8,82.1,29.5,74.9,43.9C67.7,58.3,58.5,72.2,45.9,79.5C33.2,86.8,16.6,87.3,0.7,86.2C-15.2,85.1,-30.4,82.3,-43.2,75.1C-56,67.9,-66.3,56.4,-74.8,42.7C-83.3,29,-90,14.5,-88.5,0.9C-87,-12.7,-77.4,-25.5,-68.6,-38.7C-59.8,-51.9,-51.9,-65.6,-40.5,-74.2C-29.1,-82.8,-14.6,-86.3,0.4,-87C15.4,-87.6,30.7,-83.5,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Find a Turf</h3>
              <p className="text-gray-600">
                Browse through our collection of sports turfs and find the
                perfect one based on location, sport type, and features.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Book a Slot</h3>
              <p className="text-gray-600">
                Select your preferred date and time slot, and complete the
                booking process in just a few clicks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Play & Enjoy</h3>
              <p className="text-gray-600">
                Show up at the turf at your booked time and enjoy a hassle-free
                sporting experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sport Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore by Sport
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SPORT_TYPES.map((sport, index) => (
              <Link
                key={index}
                to={`/turfs?sportTypes=${sport}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold group-hover:text-green-600 transition-colors">
                    {sport}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Quick & Easy</h3>
              <p className="text-gray-600">
                Book your preferred turf in minutes with our simple and
                intuitive booking system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">Variety of Options</h3>
              <p className="text-gray-600">
                Choose from a wide range of sports turfs for different sports
                and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
              <p className="text-gray-600">
                Get competitive prices with no hidden fees or unexpected
                charges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure Booking</h3>
              <p className="text-gray-600">
                Your bookings are confirmed instantly and secured with our
                reliable system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your Turf?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of sports enthusiasts who book their favorite turfs
            through our platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/turfs"
              className="bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Find a Turf
            </Link>
            <Link
              to="/register"
              className="bg-transparent hover:bg-green-600 border-2 border-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
