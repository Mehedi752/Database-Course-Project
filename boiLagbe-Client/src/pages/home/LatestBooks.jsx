import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { Link, useNavigate } from "react-router-dom";

const LatestBooks = () => {
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { data: latestBooks = [], refetch } = useQuery({
        queryKey: ["latestBooks"],
        queryFn: async () => {
            const res = await axiosPublic.get('/books/latest/topSix');
            return res.data;
        },
    });


    return (
        <div className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-50">
            <div className="container mx-auto px-5 lg:px-24">
                <h1 className="text-3xl lg:text-5xl font-bold text-center text-gray-900 mb-8">Latest Books</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4 lg:mx-0">
                    {
                        latestBooks.map(book => (
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
                                              onClick={() => alert(`You clicked buy for ${book.title}`)}
                                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition"
                                            >
                                              Buy Book
                                            </button>
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