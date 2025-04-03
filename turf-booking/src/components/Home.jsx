import { Link } from "react-router-dom";
import { SPORT_TYPES } from "../utils/constants";
import { useState, useEffect } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    grievanceType: "",
    orderNumber: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isContactModalOpen) {
      setTimeout(() => {
        const modal = document.querySelector(".modal-overlay");
        if (modal) modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

        const content = document.querySelector(".modal-content");
        if (content) {
          content.style.opacity = "1";
          content.style.transform = "translateY(0)";
        }
      }, 10);
    }
  }, [isContactModalOpen]);

  // Add this useEffect to handle body scrolling when modal opens/closes
  useEffect(() => {
    if (isContactModalOpen) {
      // Disable scrolling on the main page
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isContactModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation based on active tab
    let isValid = true;
    let errorMessage = "Please fill in all required fields";

    if (activeTab === "general") {
      // General contact validation
      if (!formData.name || !formData.email || !formData.message) {
        isValid = false;
      }
    } else if (activeTab === "grievance") {
      // Grievance form validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.grievanceType ||
        !formData.message
      ) {
        isValid = false;
      }
    }

    if (!isValid) {
      setFormStatus({
        type: "error",
        message: errorMessage,
      });
      return;
    }

    // Form submission logic would go here
    setFormStatus({
      type: "success",
      message:
        activeTab === "general"
          ? "Thanks for reaching out! We'll get back to you soon."
          : "Thank you for your feedback. We take all issues seriously and will address this promptly.",
    });

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      message: "",
      grievanceType: "",
      orderNumber: "",
    });

    // Close modal after a delay
    setTimeout(() => {
      setFormStatus(null);
      setIsContactModalOpen(false);
    }, 3000);
  };

  const openContactModal = () => {
    setIsContactModalOpen(true);
    // Small delay to allow the modal to be added to the DOM before starting the animation
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeContactModal = () => {
    setIsModalVisible(false);
    // Wait for the animation to finish before removing from DOM
    setTimeout(() => setIsContactModalOpen(false), 300);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section  */}
      <section className="relative py-24 overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Football turf"
            className="w-full h-full object-cover"
          />
          {/* Semi-transparent overlay that preserves image colors while ensuring text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/85 to-green-800/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-3/5 mb-10 lg:mb-0 text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-shadow-sm">
                Book Your <span className="text-green-300">Perfect</span> Sports
                Turf
              </h1>
              <p className="text-xl mb-8 text-white max-w-2xl">
                Find and book the ideal sports turf for your game in minutes. No
                hassle, no waiting. Just play.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/turfs"
                  className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg"
                >
                  Find a Turf
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent hover:bg-green-700 border-2 border-white px-8 py-4 rounded-full font-semibold transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>

            <div className="lg:w-2/5 flex justify-center">
              <div className="relative bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl">
                <h3 className="text-white text-xl font-semibold mb-3">
                  Ready to play?
                </h3>
                <p className="text-green-100 mb-4">
                  Over 500+ premium turfs available today
                </p>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs text-green-800 font-bold">
                      +
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="User profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="User profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="User profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <span className="text-sm text-white">
                    Join 10,000+ players today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract shape decoration */}
        <div className="absolute right-0 bottom-0 opacity-20 z-10">
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

      {/* Social Proof Section */}
      <section className="py-8 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-700">10K+</p>
              <p className="text-gray-500">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-700">500+</p>
              <p className="text-gray-500">Turfs Available</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-700">50+</p>
              <p className="text-gray-500">Cities</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-700">4.8</p>
              <p className="text-gray-500">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - With Timeline Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="text-green-600">How</span> It Works
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="relative md:text-right">
                {/* Number Circle */}
                <div
                  className="md:absolute md:right-0 md:translate-x-1/2 md:top-0 md:z-10 
                            w-16 h-16 bg-green-600 text-white rounded-full 
                            flex items-center justify-center text-2xl font-bold 
                            mx-auto mb-4 md:mb-0"
                >
                  1
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold mb-4">
                    Find Your Perfect Turf
                  </h3>
                  <p className="text-gray-600">
                    Browse through our extensive collection of premium sports
                    turfs. Filter by location, sport type, amenities, and
                    pricing to find the perfect match for your needs.
                  </p>
                </div>
              </div>

              <div className="md:mt-40 relative">
                <div
                  className="md:absolute md:left-0 md:-translate-x-1/2 md:top-0 md:z-10 
                            w-16 h-16 bg-green-600 text-white rounded-full 
                            flex items-center justify-center text-2xl font-bold 
                            mx-auto mb-4 md:mb-0"
                >
                  2
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold mb-4">
                    Book Available Slots
                  </h3>
                  <p className="text-gray-600">
                    View real-time availability and select your preferred date
                    and time. Our seamless booking process lets you reserve your
                    slot with just a few clicks.
                  </p>
                </div>
              </div>

              <div className="relative md:text-right">
                <div
                  className="md:absolute md:right-0 md:translate-x-1/2 md:top-0 md:z-10 
                            w-16 h-16 bg-green-600 text-white rounded-full 
                            flex items-center justify-center text-2xl font-bold 
                            mx-auto mb-4 md:mb-0"
                >
                  3
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold mb-4">
                    Secure Payment
                  </h3>
                  <p className="text-gray-600">
                    Complete your booking with our secure payment system. Pay
                    online with your preferred payment method and receive
                    instant confirmation.
                  </p>
                </div>
              </div>

              <div className="md:mt-40 relative">
                <div
                  className="md:absolute md:left-0 md:-translate-x-1/2 md:top-0 md:z-10 
                            w-16 h-16 bg-green-600 text-white rounded-full 
                            flex items-center justify-center text-2xl font-bold 
                            mx-auto mb-4 md:mb-0"
                >
                  4
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold mb-4">Play & Enjoy</h3>
                  <p className="text-gray-600">
                    Show up at your booked time and enjoy a hassle-free sporting
                    experience. No queues, no waiting - just the perfect game
                    with your friends or team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sport Categories Section - Card Grid Layout */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Explore <span className="text-green-600">by Sport</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
            Find the perfect turf for your favorite sport. We offer specialized
            facilities designed for optimal performance across a wide range of
            sports.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SPORT_TYPES.map((sport, index) => (
              <Link
                key={index}
                to={`/turfs?sportTypes=${sport}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <span className="text-5xl">{sportEmoji(sport)}</span>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors">
                    {sport}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - With Icons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Why <span className="text-green-600">Choose Us</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
            We're committed to providing the best sports turf booking experience
            possible. Here's what sets us apart from the competition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Lightning Fast Booking
              </h3>
              <p className="text-gray-600">
                Book your preferred turf in under 2 minutes with our streamlined
                and intuitive booking system. No complicated forms or long
                waits.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                🔍
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Extensive Selection
              </h3>
              <p className="text-gray-600">
                Access the largest network of sports turfs with detailed
                information, high-quality photos, and verified reviews from
                other players.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                💰
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Transparent Pricing
              </h3>
              <p className="text-gray-600">
                Enjoy competitive prices with no hidden fees. We display all
                costs upfront so you know exactly what you're paying for.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Guaranteed Bookings
              </h3>
              <p className="text-gray-600">
                Your bookings are confirmed instantly and secured with our
                reliable system. We guarantee your slot or your money back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonial Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">
            What Our <span className="text-green-600">Users Say</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
            Trusted by thousands of sports enthusiasts and team captains across
            the country
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group">
              <div className="absolute -top-8 left-10">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <span className="text-white text-2xl">❝</span>
                </div>
              </div>
              <div className="pt-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  "This platform has completely transformed how our team
                  practices. We can find and book quality football turfs without
                  any hassle. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="relative mr-5">
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Michael Thompson profile"
                      className="w-20 h-20 object-cover rounded-full ring-4 ring-green-50 group-hover:ring-green-100 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Michael Thompson</h4>
                    <p className="text-gray-600">Football Team Captain</p>
                    <div className="flex mt-1 text-yellow-400">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group">
              <div className="absolute -top-8 left-10">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <span className="text-white text-2xl">❝</span>
                </div>
              </div>
              <div className="pt-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  "As a cricket coach, I need reliable access to quality
                  practice spaces. This platform delivers exactly that - easy
                  booking, great facilities, and excellent customer service."
                </p>
                <div className="flex items-center">
                  <div className="relative mr-5">
                    <img
                      src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="Priya Sharma profile"
                      className="w-20 h-20 object-cover rounded-full ring-4 ring-green-50 group-hover:ring-green-100 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Priya Sharma</h4>
                    <p className="text-gray-600">Cricket Coach</p>
                    <div className="flex mt-1 text-yellow-400">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group">
              <div className="absolute -top-8 left-10">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-700 transition-colors">
                  <span className="text-white text-2xl">❝</span>
                </div>
              </div>
              <div className="pt-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  "I organize weekly basketball games with friends, and this
                  platform has made it so much easier to find and book courts.
                  The real-time availability feature is a game-changer!"
                </p>
                <div className="flex items-center">
                  <div className="relative mr-5">
                    <img
                      src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                      alt="David Chen profile"
                      className="w-20 h-20 object-cover rounded-full ring-4 ring-green-50 group-hover:ring-green-100 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">David Chen</h4>
                    <p className="text-gray-600">Recreational Player</p>
                    <div className="flex mt-1 text-yellow-400">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <button className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center group">
              Read More Reviews
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Get in <span className="text-green-600">Touch</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
            Have questions or need assistance? Our team is here to help. Fill
            out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Perfect Turf?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of sports enthusiasts who book their favorite turfs
            through our platform. Get started today!
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/turfs"
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg"
            >
              Find a Turf
            </Link>

            <div className="relative group">
              <button
                onClick={openContactModal}
                className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg"
              >
                Contact Us
              </button>
              <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-white shadow-lg rounded-lg p-4 w-64 transition-all duration-300 z-20 top-full left-1/2 transform -translate-x-1/2 mt-2">
                <div className="flex flex-col space-y-2 text-left">
                  <span className="font-semibold text-gray-900 pb-2 border-b">
                    How can we help?
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      openContactModal();
                      setActiveTab("general");
                    }}
                    className="text-gray-700 hover:text-green-600 text-left"
                  >
                    General Inquiry
                  </button>
                  <Link
                    to="/careers"
                    className="text-gray-700 hover:text-green-600 text-left"
                  >
                    Join Our Team →
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      openContactModal();
                      setActiveTab("grievance");
                    }}
                    className="text-gray-700 hover:text-green-600 text-left"
                  >
                    Report an Issue
                  </button>
                </div>
              </div>
            </div>

            {/* <button
              onClick={() => {
                setIsContactModalOpen(true);
                // Add small delay to ensure DOM is updated
                setTimeout(() => {
                  const modal = document.querySelector(".modal-overlay");
                  if (modal) modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

                  const content = document.querySelector(".modal-content");
                  if (content) {
                    content.style.opacity = "1";
                    content.style.transform = "translateY(0)";
                  }
                }, 10);
              }}
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg"
            >
              Contact Support
            </button> */}

            <Link
              to="/register"
              className="bg-white text-green-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg text-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            transition: "background-color 300ms ease",
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[80vh] overflow-y-auto modal-content"
            style={{
              opacity: 0,
              transform: "translateY(-16px)",
              transition: "opacity 300ms ease, transform 300ms ease",
            }}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {activeTab === "general"
                  ? "Contact Support"
                  : activeTab === "grievance"
                  ? "Report an Issue"
                  : "Contact Us"}
              </h2>
              <button
                onClick={closeContactModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8">
                {/* For general inquiries or issues only */}
                {activeTab === "general" && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">
                      Send us a message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Your Name
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
                          Email Address
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

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          placeholder="How can we help you?"
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
                          Send Message
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* For grievance reports */}
                {activeTab === "grievance" && (
                  <>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Your Name
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
                          Email Address
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

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-gray-700 font-medium mb-2"
                        >
                          Issue Details
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          placeholder="Please describe your issue in detail..."
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
                          Submit Report
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Redirect message for career-related queries */}
                {(activeTab === "trainer" || activeTab === "manager") && (
                  <div className="text-center py-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Join Our Team
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We've created a dedicated careers section with detailed
                      information about available positions and a professional
                      application process.
                    </p>
                    <Link
                      to="/careers"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
                      onClick={closeContactModal}
                    >
                      View Career Opportunities
                    </Link>
                  </div>
                )}
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
                      <p className="text-green-100">
                        Monday - Friday: 9am - 6pm
                      </p>
                      <p className="text-green-100">Saturday: 10am - 4pm</p>
                    </div>
                  </div>
                </div>

                {/* Conditional content based on active tab */}
                <div className="mt-12 pt-6 border-t border-green-500">
                  {activeTab === "grievance" && (
                    <div className="bg-green-500 bg-opacity-30 p-4 rounded-lg mt-6 mb-6">
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

                  <h4 className="font-semibold mb-4">Follow Us</h4>
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
        </div>
      )}
    </div>
  );
};

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
        return "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400";
      case "linkedin":
        return "hover:bg-blue-700";
      default:
        return "hover:bg-green-600";
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

// Helper function to return appropriate emoji for each sport
const sportEmoji = (sport) => {
  const emojiMap = {
    Football: "⚽",
    Cricket: "🏏",
    Basketball: "🏀",
    Tennis: "🎾",
    Badminton: "🏸",
    Volleyball: "🏐",
    Hockey: "🏑",
    Rugby: "🏉",
    Baseball: "⚾",
    "Table Tennis": "🏓",
    Golf: "⛳",
  };

  return emojiMap[sport] || "🏆";
};

export default Home;
