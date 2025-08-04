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

  if (isLoading) return <div className="text-center py-20">Loading book details...</div>;
  if (!book) return <div className="text-center py-20 text-red-500">Book not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Book Details Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 transition-all duration-300">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={book.image || "https://via.placeholder.com/400"}
                alt={book.title}
                className="rounded-xl w-full h-full object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
                  {book.title}
                </h1>
                <p className="text-gray-600 text-lg flex items-center mb-2">
                  <HiOutlineBookOpen className="text-blue-600 mr-2 text-xl" />
                  <span className="font-semibold">Author:</span>&nbsp;{book.author || "Unknown"}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
                  <p><span className="font-medium">Genre:</span> {book.genre || "N/A"}</p>
                  <p><span className="font-medium">Edition:</span> {book.editionYear || "N/A"}</p>
                  <p><span className="font-medium">Condition:</span> {book.condition || "N/A"}</p>
                  <p><span className="font-medium">Location:</span> {book.location || "N/A"}</p>
                </div>
                <p className="mt-6 text-gray-800 leading-relaxed">
                  <span className="text-lg font-semibold block mb-1">📖 Description:</span>
                  {book.description || "No description provided."}
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600 flex items-center mt-2">
                <BsCashStack className="mr-2 text-3xl" />
                ৳{book.finalPrice?.toFixed(2)} BDT
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  onClick={() => addToCart(book)}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                   Add to Cart
                </button>
                <button
                  onClick={() => navigate("/books")}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  ⬅️ Back to All Books
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 h-fit sticky top-24">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">👤 Seller Information</h3>
          <div className="flex flex-col items-center text-center space-y-4">
            <img
              src={book.ownerImage || "https://via.placeholder.com/80"}
              alt="Owner"
              className="w-24 h-24 rounded-full border object-cover shadow-md"
            />
            <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
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
