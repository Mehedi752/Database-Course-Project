import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { FaEdit, FaTrash } from "react-icons/fa";
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
        <div className="bg-gray-100 min-h-screen py-12 px-5 lg:px-24">
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="bg-indigo-900 py-4 px-6 rounded-t-xl">
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                        Your Added Books
                    </h1>
                    <p className="text-indigo-200 text-center mt-1">
                        Here you can manage your added books. You can update or delete them as needed.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg shadow-lg">
                        <thead className="bg-indigo-600 text-white text-lg">
                            <tr>
                                <th className="p-4">#</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4">Genre</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAddedBooks.length > 0 ? (
                                myAddedBooks.map((book, index) => (
                                    <tr key={book._id} className="border-b border-gray-200 hover:bg-gray-100 transition-all">
                                        <td className="p-4 text-center">{index + 1}</td>
                                        <td className="p-4 text-left font-semibold">{book.title}</td>
                                        <td className="p-4 text-center">
                                            <span className="relative inline-block px-3 py-2 text-sm text-black rounded-lg bg-black/10 backdrop-blur-2xl border border-black/10 ">
                                                {book.genre || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">{new Date(book.timestamp).toLocaleDateString()}</td>

                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-lg ${!bookSell? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {!bookSell? 'Sell' : 'Sold'}
                                            </span>
                                        </td>
                                    
                                        <td className="p-4 flex justify-center gap-3">
                                            <Link to={`/books/update/${book._id}`}>
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition"
                                                    onClick={() => console.log("Update Post:", book._id)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            </Link>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No posts added yet.
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