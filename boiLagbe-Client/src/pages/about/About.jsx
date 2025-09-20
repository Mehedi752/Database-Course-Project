import React from 'react'
import { FaBookOpen, FaHandshake, FaShieldAlt, FaRocket } from 'react-icons/fa'
import { MdOutlineSecurity } from 'react-icons/md'

const features = [
  {
    icon: <FaBookOpen className="text-4xl text-indigo-500 mb-4" />,
    title: 'Dynamic Book Listings',
    desc: 'Sell books with auto-pricing based on edition age, detailed info, and multiple images.'
  },
  {
    icon: <FaHandshake className="text-4xl text-indigo-500 mb-4" />,
    title: 'Real-Time Communication',
    desc: 'Connect with buyers and sellers instantly via live chat powered by Socket.io.'
  },
  {
    icon: <FaShieldAlt className="text-4xl text-indigo-500 mb-4" />,
    title: 'Secure Payments',
    desc: 'SSLCommerz integration ensures safe and smooth transactions for all purchases.'
  },
  {
    icon: <MdOutlineSecurity className="text-4xl text-indigo-500 mb-4" />,
    title: 'Role-Based Dashboards',
    desc: 'Tailored experience for Admins, Sellers, and Buyers with personalized controls.'
  },
  {
    icon: <FaRocket className="text-4xl text-indigo-500 mb-4" />,
    title: 'Smart Search & Filters',
    desc: 'Find books fast with advanced filters for genre, condition, location, and price range.'
  },
  {
    icon: <FaBookOpen className="text-4xl text-indigo-500 mb-4" />,
    title: 'Community & Reviews',
    desc: 'Build trust with seller ratings, book reviews, and community-driven transparency.'
  },
];

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-7xl mx-auto rounded-3xl shadow-2xl bg-white border border-indigo-100 overflow-hidden animate-fade-in">
        {/* Animated Header */}
        <div className="relative bg-gradient-to-r from-indigo-700 to-blue-500 px-8 py-14 text-center overflow-hidden">
          <div className="absolute left-0 top-0 w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-2xl animate-pulse -z-10" style={{top: '-3rem', left: '-3rem'}}></div>
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl animate-pulse -z-10" style={{bottom: '-2rem', right: '-2rem'}}></div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow animate-slide-down">About BoiLagbe</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-2 animate-fade-in delay-100">
            BoiLagbe is a modern platform designed to connect book lovers across Bangladesh. Whether you're buying or selling second-hand books, we provide a secure, real-time, and affordable way to trade your favorite reads online.
          </p>
        </div>

        {/* Features Grid with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-14 bg-white">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-white rounded-2xl shadow-lg border border-indigo-100 p-8 flex flex-col items-center text-center group transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {f.icon}
              </span>
              <h3 className="font-bold text-lg mb-2 text-indigo-700">{f.title}</h3>
              <p className="text-gray-600 text-base">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center py-10 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-indigo-50 animate-fade-in-up delay-200">
          <p className="text-gray-700 text-xl max-w-2xl mx-auto font-medium">
            Join the BoiLagbe community and give your old books a new home. <span className="text-indigo-600 font-bold">Safe, smart, and sustainable</span> — because every book deserves a second chance.
          </p>
        </div>
      </div>
      {/* Animations CSS */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s both; }
        .animate-fade-in-up { animation: fadeInUp 0.8s both; }
        .animate-slide-down { animation: slideDown 0.7s both; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  )
}

export default About
