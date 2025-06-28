import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/CartContext";

const Books = () => {
  const axiosPublic = useAxiosPublic();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const { addToCart } = useCart();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosPublic.get("/books");
      return res.data;
    },
  });

  console.log(books);

  const uniqueYears = ["All", ...new Set(books.map(book => book.editionYear?.toString()))]
    .sort((a, b) => {
      if (a === "All") return -1;
      return parseInt(b) - parseInt(a); // Sort descending numerically
    });



  const filteredBooks = books
    .filter(book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(book => selectedYear === "All" || book.editionYear?.toString() === selectedYear)
    .sort((a, b) => {
      if (sortOrder === "low") return a.finalPrice - b.finalPrice;
      if (sortOrder === "high") return b.finalPrice - a.finalPrice;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Search Bar */}
      <div className="mb-6 flex justify-center items-center">
        <input
          type="text"
          placeholder="🔍 Search your desired books by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-3 bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 mb-8 items-center">

        <div className="relative">
          <label className="text-gray-700 font-medium mb-2 block"> Select Edition Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-3 pr-10 bg-white rounded-lg border border-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {uniqueYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <span className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-400">▼</span>
        </div>

        {/* Post Type Filter */}
        <div className="relative">
          <label className="text-gray-700 font-medium mb-2 block"> Select Sort Order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full p-3 pr-10 bg-white rounded-lg border border-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="default">Sort by Price</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
          <span className="absolute right-3 top-14 transform -translate-y-1/2 text-gray-400">▼</span>
        </div>
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500">No books found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-lg shadow-lg transition duration-300 border border-gray-300 hover:scale-105 hover:shadow-xl"
            >
              <div>
                <img
                  src={book.image || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author || "Unknown Author"}</p>
                <p className="text-sm">Genre: {book.genre || "N/A"}</p>
                <p className="text-sm">Edition: {book.editionYear || "N/A"}</p>
                <p className="text-sm">Condition: {book.condition || "N/A"}</p>
                <p className="text-green-600 font-semibold">${book.finalPrice?.toFixed(2) || "0.00"} BDT</p>
              </div>


              <div className="mt-4 flex gap-2">
                <Link
                  to={`/books/${book._id}`} // <-- update this to match your details route
                  className="w-full text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
                >
                  Details
                </Link>
                <button
                  onClick={() => addToCart(book)}
                  className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>

          ))}
        </div>
      )
      }
    </div >
  );
};

export default Books;
