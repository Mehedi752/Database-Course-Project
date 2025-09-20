import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const LatestBooks = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  // const navigate = useNavigate();
  const { data: latestBooks = [] } = useQuery({
    queryKey: ["latestBooks"],
    queryFn: async () => {
      const res = await axiosPublic.get('/books/latest/topSix');
      return res.data;
    },
  });
  const queryClient = useQueryClient();

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
      sellerEmail: book.ownerEmail
    }

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
          queryClient.invalidateQueries(["cartItems"])
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

  return (
    <div className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-5 lg:px-24">
        <h1 className="text-3xl lg:text-5xl font-bold text-center text-gray-900 mb-8">Latest Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 lg:mx-0">
          {
            latestBooks.map(book => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full group overflow-hidden"
              >
                <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white mb-4">
                  <img
                    src={book.image || 'https://via.placeholder.com/200x250?text=No+Image'}
                    alt={book.title}
                    className="h-44 w-32 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 border border-gray-200 bg-white"
                  />
                </div>
                <div className="flex-1 flex flex-col px-4 pb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={book.title}>{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">by <span className="font-medium text-gray-700">{book.author || 'Unknown Author'}</span></p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{book.genre || 'N/A'}</span>
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Edition: {book.editionYear || 'N/A'}</span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">{book.condition || 'N/A'}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-extrabold text-green-600 mr-2">৳{book.finalPrice?.toFixed(2) || '0.00'}</span>
                    <span className="text-xs text-gray-400 font-medium">BDT</span>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Link
                      to={`/books/${book._id}`}
                      className="w-1/2 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => addToCart(book)}
                      className="w-1/2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default LatestBooks;