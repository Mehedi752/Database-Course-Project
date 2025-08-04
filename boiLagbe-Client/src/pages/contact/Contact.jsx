import React from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'

const Contact = () => {
  return (
    <section className="min-h-screen bg-white py-16 px-4 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-primary mb-4 text-center">
          Get in Touch
        </h2>
        <p className="text-center text-base-content text-lg max-w-3xl mx-auto mb-12">
          We'd love to hear from you! Whether you have a question, suggestion, or just want to say hello — drop us a message.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">

            <div className="space-y-4 text-gray-700">
              <p className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-600 mt-1" />
                <span><strong>Address:</strong> Mirpur, Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-start gap-3">
                <FaPhoneAlt className="text-blue-600 mt-1" />
                <span>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+8801609531117" className="hover:underline text-blue-700">
                    +880 160 953 1117
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <FaEnvelope className="text-blue-600 mt-1" />
                <span>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:boilagbe@gmail.com" className="hover:underline text-blue-700">
                    boilagbe@gmail.com
                  </a>
                </span>
              </p>
            </div>

            <div className="aspect-video">
              <iframe
                title="Google Map"
                className="w-full h-full rounded-lg border"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.622293769598!2d90.35532441543186!3d23.76230719423598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c1329cf165c9%3A0xd949a7a33c662dee!2sMirpur%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1661864101462!5m2!1sen!2sbd"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-gray-50 shadow-md rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
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
