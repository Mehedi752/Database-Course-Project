import { useState, useRef, useEffect } from "react";
import { BsChatLeftDots, BsThreeDotsVertical } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { CiCamera, CiVideoOn } from "react-icons/ci";
import { MdCall, MdOutlineAttachFile, MdOutlineEmojiEmotions } from "react-icons/md";
import { format } from "date-fns";
import Dropdown from "./Dropdown";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";


const ChatContainer = ({ socket, sender, receiver, refetchChats }) => {
    const axiosPublic = useAxiosPublic();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
    useEffect(() => {
        if (!socket || !sender?._id) return;

        socket.emit("authenticate", sender._id);

    }, [socket, sender?._id]);


    const { data: msgs = [], refetch: refetchMessages } = useQuery({
        queryKey: ['messages', sender.email, receiver.email],
        queryFn: async () => {
            if (!sender?._id || !receiver?._id) return [];
            const res = await axiosPublic.get(`/messages?sender=${sender._id}&receiver=${receiver._id}`);
            return res.data;
        },
        enabled: !!sender?._id && !!receiver?._id
    });
    useEffect(() => {
        msgs.length && setMessages(msgs)
    }, [msgs, setMessages])

    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            if (receiver?._id === message.sender) {
                socket.emit('messageRead', message._id);
                setMessages((prev) => [...prev, message]);
            }
        };
        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, receiver?._id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !sender?._id || !receiver?._id) return;
        const message = {
            text: newMessage,
            sender: sender._id,
            receiver: receiver._id,
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, message]);
        socket.emit("sendMessage", message);
        setTimeout(() => {
            refetchMessages();
        }, 1000);
        setNewMessage("");
    };
    useEffect(() => {
        receiver && messages.length && refetchChats()
    }, [receiver, messages.length, refetchChats])


    const formatTime = (timestamp) => {
        return format(new Date(timestamp), "h:mm a");
    };
    const deleteMessage = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this message!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosPublic.delete(`/messages/${id}`);
                    if (res.data.success) {
                        Swal.fire("Deleted!", "Your message has been deleted.", "success");
                        refetchMessages();
                    } else {
                        Swal.fire("Error!", "Failed to delete message.", "error");
                    }
                } catch (error) {
                    Swal.fire("Error!", "Failed to delete message.", "error");
                }
            }
        });
    };

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false); // Close the dropdown
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    useEffect(() => {
        if (sender?._id && receiver?._id) {
            axiosPublic.post('/messages/mark-read', {
                sender: receiver._id, // messages from this user
                receiver: sender._id  // to the current user
            }).then(() => {
                if (typeof refetchChats === 'function') {
                    refetchChats(); // Refetch users list to update unread count
                }
            });
        }
    }, [receiver?._id]);
    return (
        <div className="flex flex-col w-full bg-gradient-to-b from-white to-blue-50 rounded-r-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-6 font-semibold text-xl border-b border-blue-200 flex justify-between items-center rounded-tr-2xl">
                <div className="flex items-center gap-4">
                    <img src={receiver.photoURL} alt="" className="w-14 h-14 rounded-full border-4 border-blue-200 shadow-lg" />
                    <div className="flex flex-col">
                        <h3 className="text-lg font-bold tracking-tight">{receiver ? `${receiver?.name}` : "Chat"}</h3>
                        <p className="text-xs text-blue-100 font-light">Active Now</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <CiVideoOn className="w-8 h-8 hover:text-blue-200 cursor-pointer transition" />
                    <MdCall className="w-8 h-8 hover:text-blue-200 cursor-pointer transition" />
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="focus:outline-none"
                        >
                            <BsThreeDotsVertical className="cursor-pointer w-8 h-8 mt-1 hover:text-blue-200 transition" />
                        </button>
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-blue-100 rounded-xl shadow-xl z-10">
                                <ul className="py-2 text-gray-700">
                                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer rounded-lg">Delete Chat</li>
                                    <Link to={"/my-profile"}>
                                        <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer rounded-lg">View Profile</li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-blue-50 to-white scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                {(messages.length && receiver) ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex group ${msg.sender === sender?._id ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex min-w-20 max-w-[18rem] md:max-w-[28rem] lg:max-w-[36rem] ${msg.sender === sender?._id ? "justify-end" : "justify-start"}`}>
                                <div className={`relative pl-4 pt-2 pb-5 pr-6 w-full rounded-2xl flex flex-col shadow-lg
        ${msg.sender === sender?._id ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-blue-900 rounded-bl-none border border-blue-100"}
    `}>
                                    <BsThreeDotsVertical
                                        className={`w-5 h-5 text-blue-300 cursor-pointer absolute top-1/2 -left-8 opacity-0 transition-opacity duration-300 -translate-y-1/2 group-hover:opacity-100 ${(msg.sender === sender?._id) ? "" : "hidden"}`}
                                        onClick={() => deleteMessage(msg._id)}
                                    />
                                    <p className="break-words text-base font-medium">{msg.text}</p>
                                    <p className={`text-[11px] absolute bottom-1 right-3 ${msg.sender === sender?._id ? "text-blue-200" : "text-blue-400"}`}>
                                        {formatTime(new Date(msg.timestamp))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-blue-300">
                        <BsChatLeftDots className="w-20 h-20 mb-2" />
                        <h3 className="text-2xl font-semibold mb-2">{(receiver) ? <p className="text-center">No messages yet with <br /> <b>{receiver?.email}</b></p> : "No chat selected"}</h3>
                        <p className="text-lg">{receiver ? "Send your first message!" : "Select a user to chat"}</p>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {receiver && (
                <div className="border-t border-t-blue-100 px-6 py-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white">
                    <input
                        type="text"
                        className="flex-1 p-3 border-2 border-blue-200 rounded-full outline-none bg-white text-blue-900 shadow-md focus:ring-2 focus:ring-blue-400 text-base"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <MdOutlineEmojiEmotions className="w-7 h-7 text-blue-400 hover:text-blue-600 cursor-pointer" />
                    <MdOutlineAttachFile className="w-6 h-6 text-blue-400 hover:text-blue-600 cursor-pointer" />
                    <CiCamera className="w-7 h-7 text-blue-400 hover:text-blue-600 cursor-pointer" />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition disabled:opacity-50"
                        disabled={!newMessage.trim()}
                    >
                        <IoSend className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;