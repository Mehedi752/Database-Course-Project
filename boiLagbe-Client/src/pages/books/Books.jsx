import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Swal from 'sweetalert2'

const Books = () => {
  const axiosPublic = useAxiosPublic()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState('All')
  const [sortOrder, setSortOrder] = useState('default')
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedCondition, setSelectedCondition] = useState('All')

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axiosPublic.get('/books')
      return res.data
    }
  })

  const uniqueYears = [
    'All',
    ...new Set(books.map(book => book.editionYear?.toString()))
  ].sort((a, b) => {
    if (a === 'All') return -1
    return parseInt(b) - parseInt(a) // Sort descending numerically
  })
  const uniqueGenres = [
    ...new Set(books.map(book => book.genre).filter(Boolean))
  ]
  const uniqueConditions = [
    ...new Set(books.map(book => book.condition).filter(Boolean))
  ]

  // Calculate min and max price from books
  const allPrices = books.map(book => book.finalPrice || 0)
  const realMinPrice = allPrices.length ? Math.min(...allPrices) : 0
  const realMaxPrice = allPrices.length ? Math.max(...allPrices) : 10000

  // Ensure minPrice and maxPrice are within real range
  React.useEffect(() => {
    if (minPrice < realMinPrice) setMinPrice(realMinPrice)
    if (maxPrice > realMaxPrice) setMaxPrice(realMaxPrice)
    if (minPrice > maxPrice) setMinPrice(realMaxPrice - 1)
    if (maxPrice < minPrice) setMaxPrice(realMinPrice + 1)
  }, [realMinPrice, realMaxPrice, minPrice, maxPrice])

  // Remove category filter from filteredBooks
  const filteredBooks = books
    .filter(book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      book =>
        selectedYear === 'All' || book.editionYear?.toString() === selectedYear
    )
    .filter(book => selectedGenre === 'All' || book.genre === selectedGenre)
    .filter(
      book =>
        selectedCondition === 'All' || book.condition === selectedCondition
    )
    .filter(book => book.finalPrice >= minPrice && book.finalPrice <= maxPrice)
    .sort((a, b) => {
      if (sortOrder === 'low') return a.finalPrice - b.finalPrice
      if (sortOrder === 'high') return b.finalPrice - a.finalPrice
      return 0
    })

  const addToCart = book => {
    const cartData = {
      buyerEmail: user?.email,
      item: {
        bookId: book._id,
        title: book.title,
        price: book.finalPrice,
        image: book.image,
        bookEdition: book.editionYear
      },
      sellerEmail: book.ownerEmail
    }

    axiosPublic
      .post('/cart', cartData)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            title: 'Book Added to Cart',
            text: `"${book.title}" has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'OK',
            background: '#f0f4f8',
            color: '#333',
            confirmButtonColor: '#3B82F6'
          })
          queryClient.invalidateQueries(['cartItems'])
        }
      })
      .catch(err => {
        console.error('Error adding book to cart:', err)
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while adding the book to cart.',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#f0f4f8',
          color: '#333',
          confirmButtonColor: '#3B82F6'
        })
      })
  }

  return (
    <div className='container mx-auto px-4 py-10'>
      {/* Page Heading */}
      <div className='mb-10 text-center'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-blue-700 mb-3 drop-shadow-sm'>
          Browse Books
        </h1>
        <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
          Discover a wide selection of books across genres, editions, and
          conditions. Use the filters to find your perfect read at the best price.
        </p>
      </div>
      {/* Search Bar at top right */}
      <div className='flex justify-between mb-8'>
        <input
          type='text'
          placeholder='🔍 Search books by title...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full md:w-1/3 p-3 bg-white rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
        />

        {/* Sorting */}
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className='ml-4 p-3 bg-white rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
        >
          <option value='default'>Sort by Price</option>
          <option value='low'>Price: Low to High</option>
          <option value='high'>Price: High to Low</option>
        </select>
      </div>
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Sidebar Filter */}
        <aside className='w-full md:w-72 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-xl border border-gray-100 p-8 h-fit mb-8 md:mb-0 space-y-8'>
          <h3 className='text-2xl font-bold text-blue-700 mb-4 tracking-tight'>
            Filter Books
          </h3>
          <hr className='mb-4 border-blue-200' />
          {/* Price Range */}
          <div>
            <label className='block text-blue-900 font-semibold mb-3 text-base'>
              Price Range
            </label>
            <div className='relative flex flex-col gap-2 mb-2'>
              <div className='relative h-8 flex items-center'>
                {/* Track */}
                <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-blue-100 rounded-full' />
                {/* Range highlight */}
                <div
                  className='absolute top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded-full'
                  style={{
                    left: `${
                      ((minPrice - realMinPrice) /
                        (realMaxPrice - realMinPrice)) *
                      100
                    }%`,
                    right: `${
                      100 -
                      ((maxPrice - realMinPrice) /
                        (realMaxPrice - realMinPrice)) *
                        100
                    }%`
                  }}
                />
                {/* Min thumb */}
                <input
                  type='range'
                  min={realMinPrice}
                  max={realMaxPrice}
                  value={minPrice}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), maxPrice - 1)
                    setMinPrice(val)
                  }}
                  className='absolute w-full h-2 bg-transparent appearance-none pointer-events-auto accent-blue-500 focus:outline-none'
                  step='1'
                  style={{ zIndex: 2 }}
                />
                {/* Max thumb */}
                <input
                  type='range'
                  min={realMinPrice}
                  max={realMaxPrice}
                  value={maxPrice}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), minPrice + 1)
                    setMaxPrice(val)
                  }}
                  className='absolute w-full h-2 bg-transparent appearance-none pointer-events-auto accent-blue-500 focus:outline-none'
                  step='1'
                  style={{ zIndex: 3 }}
                />
                {/* Value badges */}
                <span
                  className='absolute -top-4 left-0 text-xs font-bold px-2 py-1 rounded  text-blue-700'
                  style={{
                    left: `calc(${
                      ((minPrice - realMinPrice) /
                        (realMaxPrice - realMinPrice)) *
                      100
                    }% - 18px)`
                  }}
                >
                  ৳{minPrice}
                </span>
                <span
                  className='absolute -top-4 right-0 text-xs font-bold px-2 py-1 rounded  text-blue-700 '
                  style={{
                    left: `calc(${
                      ((maxPrice - realMinPrice) /
                        (realMaxPrice - realMinPrice)) *
                      100
                    }% - 18px)`
                  }}
                >
                  ৳{maxPrice}
                </span>
              </div>
            </div>
          </div>
          <hr className='my-4 border-blue-100' />
          {/* Genre */}
          <div>
            <label className='block text-blue-900 font-semibold mb-2 text-base'>
              Genre
            </label>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='genre'
                  value='All'
                  checked={selectedGenre === 'All'}
                  onChange={() => setSelectedGenre('All')}
                  className='accent-blue-500'
                />
                <span className='font-medium text-gray-700'>All</span>
              </label>
              {uniqueGenres.map(genre => (
                <label
                  key={genre}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='radio'
                    name='genre'
                    value={genre}
                    checked={selectedGenre === genre}
                    onChange={() => setSelectedGenre(genre)}
                    className='accent-blue-500'
                  />
                  <span className='font-medium text-gray-700'>{genre}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className='my-4 border-blue-100' />
          {/* Condition */}
          <div>
            <label className='block text-blue-900 font-semibold mb-2 text-base'>
              Condition
            </label>
            <div className='space-y-2'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='radio'
                  name='condition'
                  value='All'
                  checked={selectedCondition === 'All'}
                  onChange={() => setSelectedCondition('All')}
                  className='accent-blue-500'
                />
                <span className='font-medium text-gray-700'>All</span>
              </label>
              {uniqueConditions.map(cond => (
                <label
                  key={cond}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='radio'
                    name='condition'
                    value={cond}
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    className='accent-blue-500'
                  />
                  <span className='font-medium text-gray-700'>{cond}</span>
                </label>
              ))}
            </div>
          </div>
          <hr className='my-4 border-blue-100' />
          {/* Edition Year */}
          <div>
            <label className='block text-blue-900 font-semibold mb-2 text-base'>
              Edition Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className='w-full p-2 bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {uniqueYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            className='w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition mt-2'
            onClick={() => {
              setSelectedYear('All')
              setSortOrder('default')
              setSelectedGenre('All')
              setSelectedCondition('All')
              setMinPrice(0)
              setMaxPrice(10000)
            }}
          >
            Clear All Filters
          </button>
        </aside>
        {/* Main Content */}
        <div className='flex-1'>
          {/* Book Grid */}
          {isLoading ? (
            <div className='text-center'>Loading...</div>
          ) : filteredBooks.length === 0 ? (
            <div className='text-center text-gray-500'>No books found.</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8'>
              {filteredBooks.map(book => (
                <div
                  key={book._id}
                  className='bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full group overflow-hidden'
                >
                  <div className='relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white mb-4'>
                    <img
                      src={
                        book.image ||
                        'https://via.placeholder.com/200x250?text=No+Image'
                      }
                      alt={book.title}
                      className='h-44 w-32 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 border border-gray-200 bg-white'
                    />
                  </div>
                  <div className='flex-1 flex flex-col px-4 pb-4'>
                    <h3
                      className='text-lg font-bold text-gray-900 mb-1 truncate'
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className='text-sm text-gray-500 mb-2'>
                      by{' '}
                      <span className='font-medium text-gray-700'>
                        {book.author || 'Unknown Author'}
                      </span>
                    </p>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      <span className='inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full'>
                        {book.genre || 'N/A'}
                      </span>
                      <span className='inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full'>
                        Edition: {book.editionYear || 'N/A'}
                      </span>
                      <span className='inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full'>
                        {book.condition || 'N/A'}
                      </span>
                    </div>
                    <div className='flex items-center mb-4'>
                      <span className='text-xl font-extrabold text-green-600 mr-2'>
                        ৳{book.finalPrice?.toFixed(2) || '0.00'}
                      </span>
                      <span className='text-xs text-gray-400 font-medium'>
                        BDT
                      </span>
                    </div>
                    <div className='mt-auto flex gap-2'>
                      <Link
                        to={`/books/${book._id}`}
                        className='w-1/2 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400'
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(book)}
                        className={`w-1/2 px-3 py-2 text-white text-sm font-semibold rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-green-400 ${user?.email === book.ownerEmail ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={user?.email === book.ownerEmail}
                        title={user?.email === book.ownerEmail ? 'You cannot add your own book to cart.' : 'Add to Cart'}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Books
