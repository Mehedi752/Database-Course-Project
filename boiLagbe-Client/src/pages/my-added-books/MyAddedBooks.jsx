import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const MyAddedBooks = () => {
    const { user, bookSell } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: myAddedBooks = [], refetch } = useQuery({
        queryKey: ['myAddedBooks', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/books/myAdded/${user?.email}`);
            return res.data;
        },
    });

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you really want to delete this book?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPublic.delete(`/books/${id}`)
                    .then(() => {
                        Swal.fire("Deleted!", "Your post has been deleted.", "success");
                        refetch();
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Oops...", "Something went wrong! Please try again.", "error");
                    });
            }
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-12 px-2 md:px-8 lg:px-24">
            <div className="max-w-5xl mx-auto rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border border-blue-100">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 py-8 px-4 bg-gradient-to-r from-indigo-700 to-blue-600 rounded-t-3xl shadow-md">
                    <div className="flex items-center gap-3">
                        <span className="bg-white/20 p-3 rounded-full text-white text-3xl shadow-lg"><FaBookOpen /></span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">My Added Books</h1>
                    </div>
                    <p className="text-indigo-100 text-center max-w-xl mt-2 text-base md:text-lg font-medium">
                        Manage all the books you have added. Update details or remove books you no longer wish to offer.
                    </p>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto px-2 md:px-6 py-8">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="bg-blue-100/80 text-indigo-900 text-lg rounded-xl">
                                <th className="p-4 rounded-l-xl font-semibold">#</th>
                                <th className="p-4 text-left font-semibold">Title</th>
                                <th className="p-4 font-semibold">Genre</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 rounded-r-xl font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAddedBooks.length > 0 ? (
                                myAddedBooks.map((book, index) => (
                                    <tr key={book._id} className="bg-white/80 hover:bg-blue-50 transition-all shadow-sm rounded-xl">
                                        <td className="p-4 text-center text-indigo-700 font-bold">{index + 1}</td>
                                        <td className="p-4 text-left font-semibold text-gray-900 max-w-xs truncate">{book.title}</td>
                                        <td className="p-4 text-center">
                                            <span className="inline-block px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full border border-blue-200">
                                                {book.genre || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-gray-700">{new Date(book.timestamp).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${!bookSell ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                                {!bookSell ? 'Sell' : 'Sold'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2 md:gap-3">
                                            <Link to={`/books/update/${book._id}`} title="Edit Book">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    onClick={() => console.log("Update Post:", book._id)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                title="Delete Book"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-4">
                                            <svg width="80" height="80" fill="none" viewBox="0 0 24 24" className="mx-auto">
                                                <rect width="24" height="24" rx="12" fill="#e0e7ff"/>
                                                <path d="M8 17V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 17v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span className="text-lg font-medium text-indigo-400">No books added yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyAddedBooks;