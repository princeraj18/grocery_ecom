// <!-- ContactUs.jsx -->
import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-gray-800">
            Contact <span className="text-indigo-600">Grocify</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            We'd love to hear from you. Get in touch with us anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-indigo-600">
                  Address
                </h3>
                <p className="text-gray-600">
                  123 Market Street, Mumbai, India
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-indigo-600">
                  Email
                </h3>
                <p className="text-gray-600">support@grocify.com</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-indigo-600">
                  Phone
                </h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-lg p-10">
            <form className="space-y-6">
              
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;