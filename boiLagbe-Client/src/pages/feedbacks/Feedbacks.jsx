import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar, FaUserCircle, FaThumbsUp, FaReply } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { toast } from 'react-toastify';

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
        addReply(feedback._id, replyText.trim(), replyAnonymous);
        setReplyText("");
        setReplyAnonymous(true);
        setReplyingTo(null);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-xl border border-indigo-100 rounded-2xl p-7 flex flex-col space-y-4 transition-all duration-300 hover:shadow-2xl"
        >
            <div className="flex items-center space-x-4">
                <Avatar name={feedback.anonymous ? "Anonymous" : feedback.name} />
                <div>
                    <h3 className="text-lg font-bold text-indigo-900 flex items-center space-x-2">
                        <span>
                            {feedback.anonymous ? "Anonymous" : feedback.name}
                        </span>
                        <StarRatingDisplay rating={feedback.rating} />
                    </h3>
                    <p className="text-xs text-gray-400">{feedback.email && !feedback.anonymous ? feedback.email : null}</p>
                </div>
            </div>

            <p className="text-gray-700 text-base whitespace-pre-wrap italic border-l-4 border-indigo-200 pl-4 bg-white/60 rounded-lg py-2">{feedback.message}</p>

            {/* Likes & Reply Buttons */}
            <div className="flex items-center justify-between text-gray-500 mt-2">
                <button
                    onClick={() => onLike(feedback._id)}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none px-3 py-1 rounded-full bg-indigo-50 hover:bg-blue-100 transition"
                    aria-label="Like feedback"
                >
                    <FaThumbsUp className="text-lg" />
                    <span className="font-semibold">{feedback.likes || 0}</span>
                </button>

                <button
                    onClick={() => setReplyingTo(feedback._id === replyingTo ? null : feedback._id)}
                    className="flex items-center gap-1 hover:text-blue-600 focus:outline-none px-3 py-1 rounded-full bg-indigo-50 hover:bg-blue-100 transition"
                    aria-label="Reply to feedback"
                >
                    <FaReply className="text-lg" />
                    <span>Reply</span>
                </button>
            </div>

            {/* Replies */}
            {feedback.replies && feedback.replies.length > 0 && (
                <div className="pl-10 border-l-2 border-indigo-100 space-y-3 mt-2">
                    {feedback.replies.map((rep, i) => (
                        <div key={i} className="bg-indigo-50 p-3 rounded-lg shadow flex justify-between items-center">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                <span className="font-semibold text-indigo-700">{rep.name}:</span> {rep.message}
                            </p>
                            <button
                                onClick={() => onLoveReply(feedback._id, i)}
                                className="flex items-center gap-1 text-pink-600 hover:text-pink-800 focus:outline-none px-2 py-1 rounded-full bg-pink-50 hover:bg-pink-100 transition"
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
            {replyingTo === feedback._id && (
                <form
                    onSubmit={handleReplySubmit}
                    className="mt-3 flex flex-col space-y-2 bg-white/80 rounded-xl p-4 border border-indigo-100"
                >
                    <textarea
                        className="textarea textarea-bordered resize-none text-base"
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
    const axiosPublic = useAxiosPublic();
    const [feedbacks, setFeedbacks] = useState([]);

    const [newFeedback, setNewFeedback] = useState({
        name: "",
        email: "",
        message: "",
        rating: 5,
        anonymous: false,
    });

    useEffect(() => {
        axiosPublic.get('/feedbacks').then(res => setFeedbacks(res.data));
    }, []);

    const handleLoveReply = async (feedbackId, replyIndex) => {
        try {
            await axiosPublic.patch(`/feedbacks/${feedbackId}/reply-love`, { replyIndex });
            setFeedbacks(prev => prev.map(fb => {
                if (fb._id === feedbackId) {
                    const updatedReplies = fb.replies.map((rep, i) =>
                        i === replyIndex ? { ...rep, loves: (rep.loves || 0) + 1 } : rep
                    );
                    return { ...fb, replies: updatedReplies };
                }
                return fb;
            }));
        } catch {
            toast.error('Failed to love reply');
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newFeedback.name && !newFeedback.anonymous) {
            toast.error('Please enter your name or select anonymous.');
            return;
        }
        if (!newFeedback.message.trim()) {
            toast.error('Please enter your feedback.');
            return;
        }
        try {
            const { data } = await axiosPublic.post('/feedbacks', {
                ...newFeedback,
                likes: 0,
                replies: [],
            });
            setFeedbacks([data, ...feedbacks]);
            setNewFeedback({ name: '', email: '', message: '', rating: 5, anonymous: false });
            setShowModal(false);
            toast.success('Feedback submitted!');
        } catch {
            toast.error('Failed to submit feedback');
        }
    };

    const handleLike = async (id) => {
        try {
            await axiosPublic.patch(`/feedbacks/${id}/like`);
            setFeedbacks(prev => prev.map(fb => fb._id === id ? { ...fb, likes: (fb.likes || 0) + 1 } : fb));
        } catch {
            toast.error('Failed to like feedback');
        }
    };

    const addReply = async (id, replyMsg, anonymous) => {
        try {
            const reply = { name: anonymous ? 'Anonymous' : user?.displayName || 'User', message: replyMsg, loves: 0 };
            await axiosPublic.patch(`/feedbacks/${id}/reply`, { reply });
            setFeedbacks(prev => prev.map(fb =>
                fb._id === id ? { ...fb, replies: [...(fb.replies || []), reply] } : fb
            ));
        } catch {
            toast.error('Failed to add reply');
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-16 px-2">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6 md:gap-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 tracking-tight">What Our Readers Say</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl text-lg font-semibold transition-all"
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
                            className="grid grid-cols-1 md:grid-cols-2 gap-10"
                        >
                            {feedbacks.map((fb) => (
                                <FeedbackCard
                                    key={fb._id}
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
                            className="fixed inset-0 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            style={{ background: 'transparent' }}
                        >
                            <motion.div
                                className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg relative border border-indigo-100"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-indigo-900 text-center">Share Your Feedback</h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col space-y-5"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0">
                                        <div className="form-control flex-grow">
                                            <label className="label">
                                                <span className="label-text font-semibold">Name</span>
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
                                            <span className="text-gray-700 font-medium">Anonymous</span>
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
                                            <span className="label-text font-semibold">Feedback Message</span>
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
                                            <span className="label-text font-semibold">Rating</span>
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
