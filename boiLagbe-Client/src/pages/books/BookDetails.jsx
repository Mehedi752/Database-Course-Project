import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaMapMarkerAlt, FaPhoneAlt, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsCashStack } from "react-icons/bs";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const QueryClient = useQueryClient();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/books/${id}`);
      return res.data;
    },
  });

  const addToCart = (book) => {
    const cartData = {
      buyerEmail: user?.email,
      item: {
        bookId: book._id,
        title: book.title,
        price: book.finalPrice,
        image: book.image,
        bookEdition: book.editionYear,
      },
      sellerEmail: book.ownerEmail,
    };

    axiosPublic.post('/cart', cartData)
      .then(res => {
        if (res.data.insertedId) {
          Swal.fire({
            title: "Book Added to Cart",
            text: `"${book.title}" has been added to your cart.`,
            icon: "success",
            confirmButtonText: "OK",
            background: "#f0f4f8",
            color: "#333",
            confirmButtonColor: "#3B82F6",
          });
          QueryClient.invalidateQueries(["cartItems"]);
        }
      })
      .catch(err => {
        console.error("Error adding book to cart:", err);
        Swal.fire({
          title: "Error",
          text: "An error occurred while adding the book to cart.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#f0f4f8",
          color: "#333",
          confirmButtonColor: "#3B82F6",
        });
      });
  };

  // Animated Loader
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
      <span className="text-blue-700 font-semibold text-lg tracking-wide animate-pulse">Loading book details...</span>
    </div>
  );

  if (isLoading) return <Loader />;
  if (!book) return <div className="text-center py-20 text-red-500">Book not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 py-12 px-2 md:px-4 flex flex-col items-center justify-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-10">
        
        {/* Book Details Card: Image + Details Side by Side */}
        <div className="flex-1 flex flex-col items-center animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-100 p-0 md:p-0 flex flex-col md:flex-row items-stretch w-full max-w-4xl overflow-hidden">
            {/* Book Image Left */}
            <div className="flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 md:rounded-l-3xl md:rounded-r-none p-8 md:p-10 w-full md:w-[340px] min-h-[340px]">
              <img
                src={book.image || 'https://via.placeholder.com/400'}
                alt={book.title}
                className="rounded-2xl w-56 h-80 object-cover shadow-xl border-2 border-indigo-100 transition-transform duration-300 hover:scale-105"
              />
            </div>
            {/* Book Info Right */}
            <div className="flex-1 flex flex-col justify-between p-8 md:p-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-2 leading-tight text-left">
                  {book.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold uppercase tracking-wide shadow">{book.genre || 'N/A'}</span>
                  <span className="text-gray-500 text-sm flex items-center"><HiOutlineBookOpen className="mr-1 text-blue-500" />by {book.author || 'Unknown'}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2 text-gray-700 text-sm mb-4">
                  <p><span className="font-medium">Edition:</span> {book.editionYear || 'N/A'}</p>
                  <p><span className="font-medium">Condition:</span> {book.condition || 'N/A'}</p>
                  <p><span className="font-medium">Location:</span> {book.location || 'N/A'}</p>
                </div>
                <div className="text-gray-800 leading-relaxed text-base bg-white/60 rounded-xl p-4 shadow-inner mb-4">
                  <span className="text-lg font-semibold block mb-1 text-indigo-800">📖 Description:</span>
                  {book.description || 'No description provided.'}
                </div>
              </div>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full">
                <div className="flex items-center text-xl font-bold text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 px-5 py-2 rounded-xl shadow border border-green-200">
                  <BsCashStack className="mr-2 text-2xl" />
                  ৳{book.finalPrice?.toFixed(2)} BDT
                </div>
                <button
                  onClick={() => addToCart(book)}
                  className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow transition-all duration-300 text-base"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate('/books')}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow transition-all duration-300 text-base"
                >
                  ⬅️ Back
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Seller Info Card */}
        <div className="bg-white/90 border border-indigo-100 rounded-3xl shadow-2xl p-8 h-fit sticky top-24 animate-fade-in flex flex-col items-center">
          <h3 className="text-2xl font-bold text-indigo-900 mb-6 border-b pb-3 w-full text-center">👤 Seller Information</h3>
          <div className="flex flex-col items-center text-center space-y-4 w-full">
            <img
              src={book.ownerImage || "https://via.placeholder.com/80"}
              alt="Owner"
              className="w-24 h-24 rounded-full border-2 border-indigo-200 object-cover shadow-md mb-2"
            />
            <p className="text-lg font-semibold text-indigo-800 flex items-center justify-center">
              <FaUser className="text-blue-500 mr-2" /> {book.ownerName}
            </p>
            <p className="text-sm text-gray-700 flex items-center justify-center">
              <MdEmail className="text-red-500 mr-2" /> {book.ownerEmail}
            </p>
            <p className="text-sm text-gray-700 flex items-center justify-center">
              <FaPhoneAlt className="text-green-500 mr-2" /> {book.phone || "N/A"}
            </p>
            <p className="text-sm text-gray-700 flex items-center justify-center">
              <FaMapMarkerAlt className="text-purple-500 mr-2" /> {book.location || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
