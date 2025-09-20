import React from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

const Contact = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center py-16 px-2">
      <div className="w-full max-w-7xl mx-auto rounded-3xl shadow-2xl bg-white border border-indigo-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 to-blue-500 px-8 py-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow">
            Get in Touch
          </h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-2">
            We'd love to hear from you! Whether you have a question, suggestion, or just want to say hello — drop us a message.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 px-8 py-12">
          {/* Contact Info */}
          <div className="space-y-8 flex flex-col justify-between">
            <div className="space-y-5 text-gray-700">
              <p className="flex items-start gap-3 text-base md:text-lg">
                <FaMapMarkerAlt className="text-indigo-500 mt-1" />
                <span><strong>Address:</strong> Mirpur, Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-start gap-3 text-base md:text-lg">
                <FaPhoneAlt className="text-indigo-500 mt-1" />
                <span>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+8801609531117" className="hover:underline text-indigo-600 font-medium">
                    +880 160 953 1117
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3 text-base md:text-lg">
                <FaEnvelope className="text-indigo-500 mt-1" />
                <span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:boilagbe@gmail.com" className="hover:underline text-indigo-600 font-medium">
                    boilagbe@gmail.com
                  </a>
                </span>
              </p>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-indigo-100 shadow">
              <iframe
                title="Google Map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.622293769598!2d90.35532441543186!3d23.76230719423598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1329cf165c9%3A0xd949a7a33c662dee!2sMirpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1661864101462!5m2!1sen!2sbd"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
          {/* Contact Form */}
          <form className="bg-indigo-50 shadow-md rounded-xl p-8 space-y-7 flex flex-col justify-center">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 border border-indigo-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 px-4 rounded-md font-semibold text-lg shadow hover:scale-[1.02] hover:shadow-lg transition-all duration-150"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
