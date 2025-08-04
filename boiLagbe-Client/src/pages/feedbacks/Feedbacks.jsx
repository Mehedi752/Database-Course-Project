import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaUserCircle, FaThumbsUp, FaReply } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

// Helper for star rating display
const StarRatingDisplay = ({ rating }) => {
    return (
        <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
            )}
        </div>
    );
};

// Star rating input component
const StarRatingInput = ({ rating, setRating }) => {
    return (
        <div className="flex space-x-1 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} Star${star > 1 ? "s" : ""}`}
                    className="focus:outline-none"
                >
                    {star <= rating ? (
                        <FaStar className="text-yellow-400 text-2xl" />
                    ) : (
                        <FaRegStar className="text-yellow-400 text-2xl" />
                    )}
                </button>
            ))}
        </div>
    );
};





// Avatar generator from name initials
const Avatar = ({ name }) => {
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

    // Random pastel background color
    const colors = [
        "bg-pink-400",
        "bg-purple-400",
        "bg-indigo-400",
        "bg-green-400",
        "bg-yellow-400",
        "bg-red-400",
    ];
    const color = colors[name ? name.charCodeAt(0) % colors.length : 0];

    return (
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${color}`}
            title={name || "Anonymous"}
        >
            {initials}
        </div>
    );
};

// Single Feedback Card with like & replies
const FeedbackCard = ({
    feedback,
    onLike,
    onReply,
    addReply,
    replyingTo,
    setReplyingTo,
    onLoveReply 
}) => {
    const [replyText, setReplyText] = useState("");
    const [replyAnonymous, setReplyAnonymous] = useState(true);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        addReply(feedback.id, replyText.trim(), replyAnonymous);
        setReplyText("");
        setReplyAnonymous(true);
        setReplyingTo(null);
    };



    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card bg-white shadow-lg border border-gray-200 rounded-xl p-6 flex flex-col space-y-4"
        >
            <div className="flex items-center space-x-4">
                <Avatar name={feedback.anonymous ? "Anonymous" : feedback.name} />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span>
                            {feedback.anonymous ? "Anonymous" : feedback.name}
                        </span>
                        <StarRatingDisplay rating={feedback.rating} />
                    </h3>
                    <p className="text-sm text-gray-500">{feedback.email && !feedback.anonymous ? feedback.email : null}</p>
                </div>
            </div>

            <p className="text-gray-700 whitespace-pre-wrap">{feedback.message}</p>

            {/* Likes & Reply Buttons */}
            <div className="flex items-center justify-between text-gray-600">
                <button
                    onClick={() => onLike(feedback.id)}
                    className="flex items-center space-x-1 hover:text-blue-600 focus:outline-none"
                    aria-label="Like feedback"
                >
                    <FaThumbsUp className="text-lg" />
                    <span>{feedback.likes || 0}</span>
                </button>

                <button
                    onClick={() => setReplyingTo(feedback.id === replyingTo ? null : feedback.id)}
                    className="flex items-center space-x-1 hover:text-blue-600 focus:outline-none"
                    aria-label="Reply to feedback"
                >
                    <FaReply className="text-lg" />
                    <span>Reply</span>
                </button>
            </div>

            {/* Replies */}
            {feedback.replies && feedback.replies.length > 0 && (
                <div className="pl-12 border-l border-gray-300 space-y-3 mt-2">
                    {feedback.replies.map((rep, i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded-lg shadow-sm flex justify-between items-center">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                <span className="font-semibold">{rep.name}:</span> {rep.message}
                            </p>
                            <button
                                onClick={() => onLoveReply(feedback.id, i)}
                                className="flex items-center space-x-1 text-pink-600 hover:text-pink-800 focus:outline-none"
                                aria-label="Love reply"
                                title="Love this reply"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25a5.25 5.25 0 00-8.25-4.5A5.25 5.25 0 004.5 8.25c0 5.25 8.25 11.25 8.25 11.25s8.25-6 8.25-11.25z"
                                    />
                                </svg>
                                <span>{rep.loves || 0}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}



            {/* Reply Form */}
            {replyingTo === feedback.id && (
                <form
                    onSubmit={handleReplySubmit}
                    className="mt-3 flex flex-col space-y-2"
                >
                    <textarea
                        className="textarea textarea-bordered resize-none"
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                    />

                    <label className="flex items-center space-x-2 cursor-pointer select-none text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={replyAnonymous}
                            onChange={() => setReplyAnonymous((prev) => !prev)}
                            className="checkbox checkbox-primary"
                        />
                        <span>Reply as anonymous</span>
                    </label>

                    <button
                        type="submit"
                        className="btn btn-sm btn-primary self-end"
                    >
                        Submit Reply
                    </button>
                </form>
            )}
        </motion.div>
    );
};

const FeedbacksPage = () => {
    const { user } = useAuth();
    console.log(user);
    const [feedbacks, setFeedbacks] = useState([
        {
            id: 1,
            name: "Hasan Mahmud",
            email: "hasan@example.com",
            message: "BoiLagbe is an amazing platform for book lovers. Highly recommend! 😊",
            rating: 5,
            anonymous: false,
            likes: 17,
            replies: [
                { name: "Ayesha", message: "Totally agree! Love this platform." },
                { name: "Rahim", message: "Great collection of books!" },
                { name: "Rina", message: "I found my favorite book here!" },
                { name: "Ali", message: "Best place to buy books online!" },
                { name: "Kaiser", message: "I love the user interface!" },
            ],
        },
        {
            id: 2,
            name: "Ayesha Khatun",
            email: "ayesha@example.com",
            message: "Great UI and the collection is diverse. Keep up the good work! 👍",
            rating: 4,
            anonymous: true,
            likes: 43,
            replies: [
                { name: "Hasan", message: "Thanks for the feedback!" },
                { name: "Karim", message: "I love the UI too!" },
                { name: "Reza", message: "Diverse collection indeed!" },
                { name: "Akbar", message: "UI is user-friendly!" },
            ],
        },
    ]);

    const [newFeedback, setNewFeedback] = useState({
        name: "",
        email: "",
        message: "",
        rating: 5,
        anonymous: false,
    });

    const handleLoveReply = (feedbackId, replyIndex) => {
        setFeedbacks((prev) =>
            prev.map((fb) => {
                if (fb.id === feedbackId) {
                    const updatedReplies = fb.replies.map((rep, i) =>
                        i === replyIndex ? { ...rep, loves: (rep.loves || 0) + 1 } : rep
                    );
                    return { ...fb, replies: updatedReplies };
                }
                return fb;
            })
        );
    };


    const [showModal, setShowModal] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewFeedback((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newFeedback.name && !newFeedback.anonymous) {
            alert("Please enter your name or select anonymous.");
            return;
        }
        if (!newFeedback.message.trim()) {
            alert("Please enter your feedback.");
            return;
        }

        const newEntry = {
            id: Date.now(),
            ...newFeedback,
            likes: 0,
            replies: [],
        };
        setFeedbacks([newEntry, ...feedbacks]);
        setNewFeedback({
            name: "",
            email: "",
            message: "",
            rating: 5,
            anonymous: false,
        });
        setShowModal(false);
    };

    const handleLike = (id) => {
        setFeedbacks((prev) =>
            prev.map((fb) =>
                fb.id === id ? { ...fb, likes: (fb.likes || 0) + 1 } : fb
            )
        );
    };

    const addReply = (id, replyMsg, anonymous) => {
        setFeedbacks((prev) =>
            prev.map((fb) =>
                fb.id === id
                    ? {
                        ...fb,
                        replies: [
                            ...fb.replies,
                            { name: anonymous ? "Anonymous" : user?.displayName || "User", message: replyMsg, loves: 0 },
                        ],
                    }
                    : fb
            )
        );
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-indigo-900">
                        What Our Readers Say
                    </h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
                    >
                        + Add Feedback
                    </button>
                </div>

                <AnimatePresence>
                    {feedbacks.length === 0 ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-gray-500"
                        >
                            No feedbacks yet. Be the first to add one!
                        </motion.p>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {feedbacks.map((fb) => (
                                <FeedbackCard
                                    key={fb.id}
                                    feedback={fb}
                                    onLike={handleLike}
                                    onReply={() => { }}
                                    addReply={addReply}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    onLoveReply={handleLoveReply}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                        >
                            <motion.div
                                className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-2xl font-bold mb-6 text-indigo-900">
                                    Share Your Feedback
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col space-y-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="form-control flex-grow">
                                            <label className="label">
                                                <span className="label-text font-semibold">
                                                    Name
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newFeedback.name}
                                                onChange={handleChange}
                                                disabled={newFeedback.anonymous}
                                                placeholder="Your Name"
                                                className="input input-bordered w-full"
                                            />
                                        </div>

                                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                name="anonymous"
                                                checked={newFeedback.anonymous}
                                                onChange={handleChange}
                                                className="checkbox checkbox-primary"
                                            />
                                            <span className="text-gray-700 font-medium">
                                                Anonymous
                                            </span>
                                        </label>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={newFeedback.email}
                                            onChange={handleChange}
                                            placeholder="Your Email (optional)"
                                            className="input input-bordered w-full"
                                            disabled={newFeedback.anonymous}
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Feedback Message
                                            </span>
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={newFeedback.message}
                                            onChange={handleChange}
                                            placeholder="Write your feedback..."
                                            className="textarea textarea-bordered resize-none"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">
                                                Rating
                                            </span>
                                        </label>
                                        <StarRatingInput
                                            rating={newFeedback.rating}
                                            setRating={(rate) =>
                                                setNewFeedback((prev) => ({ ...prev, rating: rate }))
                                            }
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Submit Feedback
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FeedbacksPage;
