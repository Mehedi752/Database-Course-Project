import React from 'react'
import { FaBookOpen, FaHandshake, FaShieldAlt, FaRocket } from 'react-icons/fa'
import { MdOutlineSecurity } from 'react-icons/md'

const About = () => {
  return (
    <section className="bg-base-100 py-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">About BoiLagbe</h2>
          <p className="text-base-content text-lg max-w-3xl mx-auto">
            BoiLagbe is a modern platform designed to connect book lovers across Bangladesh. Whether you're buying or selling second-hand books, we provide a secure, real-time, and affordable way to trade your favorite reads online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Feature Card 1 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <FaBookOpen className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Dynamic Book Listings</h3>
              <p>Sell books with auto-pricing based on edition age, detailed info, and multiple images.</p>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <FaHandshake className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Real-Time Communication</h3>
              <p>Connect with buyers and sellers instantly via live chat powered by Socket.io.</p>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <FaShieldAlt className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Secure Payments</h3>
              <p>SSLCommerz integration ensures safe and smooth transactions for all purchases.</p>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <MdOutlineSecurity className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Role-Based Dashboards</h3>
              <p>Tailored experience for Admins, Sellers, and Buyers with personalized controls.</p>
            </div>
          </div>

          {/* Feature Card 5 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <FaRocket className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Smart Search & Filters</h3>
              <p>Find books fast with advanced filters for genre, condition, location, and price range.</p>
            </div>
          </div>

          {/* Feature Card 6 */}
          <div className="card bg-base-200 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <FaBookOpen className="text-4xl text-primary mb-4" />
              <h3 className="card-title text-xl">Community & Reviews</h3>
              <p>Build trust with seller ratings, book reviews, and community-driven transparency.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-base-content max-w-2xl mx-auto">
            Join the BoiLagbe community and give your old books a new home. Safe, smart, and sustainable – because every book deserves a second chance.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
