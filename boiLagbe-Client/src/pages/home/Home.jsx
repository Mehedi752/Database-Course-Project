import React from 'react'
import Banner from './Banner'
import LatestBooks from './LatestBooks'
import {
  FaBookOpen,
  FaUsers,
  FaExchangeAlt,
  FaShieldAlt,
  FaRocket,
  FaQuestionCircle,
  FaHandshake
} from 'react-icons/fa'

// Website Statistics Section
const stats = [
  {
    icon: <FaBookOpen className='text-4xl text-indigo-700' />,
    label: 'Books Listed',
    value: 1200
  },
  {
    icon: <FaUsers className='text-4xl text-indigo-700' />,
    label: 'Active Users',
    value: 850
  },
  {
    icon: <FaExchangeAlt className='text-4xl text-indigo-700' />,
    label: 'Transactions',
    value: 3200
  },
  {
    icon: <FaShieldAlt className='text-4xl text-indigo-700' />,
    label: 'Secure Payments',
    value: '100%'
  }
]

const Statistics = () => (
  <section className='py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-white'>
    <div className='max-w-7xl mx-auto px-4'>
      <div className='flex flex-wrap justify-center gap-8'>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className='flex flex-col items-center bg-white rounded-3xl shadow-xl border border-indigo-100 px-10 py-8 min-w-[200px] max-w-xs transition-transform duration-300 hover:scale-105 animate-fade-in-up'
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className='mb-3'>{stat.icon}</div>
            <div
              className='text-4xl font-extrabold text-indigo-800 mb-1 counter'
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {stat.value}
            </div>
            <div className='text-gray-500 text-lg font-medium tracking-wide'>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      .counter { transition: all 0.7s cubic-bezier(.4,2,.6,1); }
      .animate-fade-in-up { animation: fadeInUp 0.8s both; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
    `}</style>
  </section>
)

// Why Choose Us Section
const whyChoose = [
  {
    icon: <FaRocket className='text-3xl text-blue-700' />,
    title: 'Fast & Easy',
    desc: 'List and find books in seconds with smart search and instant chat.'
  },
  {
    icon: <FaShieldAlt className='text-3xl text-blue-700' />,
    title: 'Safe & Secure',
    desc: 'SSLCommerz payments, verified users, and protected transactions.'
  },
  {
    icon: <FaHandshake className='text-3xl text-blue-700' />,
    title: 'Community Driven',
    desc: 'Ratings, reviews, and a supportive book-loving community.'
  },
  {
    icon: <FaBookOpen className='text-3xl text-blue-700' />,
    title: 'Smart Pricing',
    desc: 'Automatic price suggestions based on edition and condition.'
  }
]

const WhyChooseUs = () => (
  <section className='py-20 bg-white'>
    <div className='max-w-7xl mx-auto px-4'>
      <h2 className='text-4xl font-extrabold text-center text-indigo-800 mb-14 tracking-tight'>
        Why Choose <span className='text-blue-600'>BoiLagbe?</span>
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        {whyChoose.map((item, i) => (
          <div
            key={item.title}
            className='bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl shadow-xl border border-indigo-100 p-10 flex flex-col items-center text-center animate-fade-in-up transition-transform duration-300 hover:scale-105'
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className='mb-3'>{item.icon}</div>
            <h3 className='font-bold text-xl mb-2 text-indigo-700'>
              {item.title}
            </h3>
            <p className='text-gray-600 text-base'>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <style>{`
      .animate-fade-in-up { animation: fadeInUp 0.8s both; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
    `}</style>
  </section>
)

// FAQ Section
const faqs = [
  {
    q: 'How do I list a book for sale?',
    a: 'Sign in, go to Add Book, fill in the details, and submit. Your book will be live instantly.'
  },
  {
    q: 'Is payment secure?',
    a: 'Yes, all payments are processed via SSLCommerz with full encryption.'
  },
  {
    q: 'Can I chat with buyers/sellers?',
    a: 'Absolutely! Use our real-time chat to connect instantly with other users.'
  },
  {
    q: 'How is the book price determined?',
    a: 'Our smart pricing tool suggests a fair price based on edition year and condition.'
  }
]

const FAQ = () => {
  const [open, setOpen] = React.useState(null)
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-indigo-800 mb-14 flex items-center justify-center gap-2 tracking-tight">
          <FaQuestionCircle className="text-2xl text-indigo-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={`rounded-2xl border border-indigo-100 bg-white/80 shadow-xl overflow-hidden animate-fade-in-up transition-all duration-300 ${open === i ? 'ring-2 ring-blue-400' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <button
                className="w-full flex justify-between items-center px-8 py-6 text-left focus:outline-none group text-lg font-semibold text-indigo-700 bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-white transition-colors duration-300"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
              >
                <span className="flex items-center gap-2">
                  <FaQuestionCircle className="text-xl text-blue-400" />
                  {faq.q}
                </span>
                <span
                  className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xl transition-transform duration-300 ${open === i ? 'rotate-180 bg-blue-200' : ''}`}
                >
                  ▼
                </span>
              </button>
              <div
                id={`faq-panel-${i}`}
                className={`px-8 pb-6 text-gray-700 text-base transition-all duration-300 ${open === i ? 'block animate-fade-in' : 'hidden'}`}
                style={{ minHeight: open === i ? '48px' : '0' }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in-up { animation: fadeInUp 0.8s both; }
        .animate-fade-in { animation: fadeIn 0.5s both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </section>
  )
}

const Home = () => {
  return (
    <div>
      <Banner />
      <Statistics />
      <LatestBooks />
      <WhyChooseUs />
      <FAQ />
    </div>
  )
}

export default Home
