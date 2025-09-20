import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNowStrict } from 'date-fns';
import { FaRegHandPointLeft } from "react-icons/fa";

const ADMIN_EMAIL = "mehedihasansagor301@gmail.com";

const ChatSidebar = ({ users, count }) => {
    const timeAgo = (timestamp) => {
        const agoTime = formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true })
            .replace('minutes', 'm')
            .replace('minute', 'm')
            .replace('hours', 'h')
            .replace('hour', 'h')
            .replace('days', 'd')
            .replace('day', 'd')
            .replace('weeks', 'w')
            .replace('week', 'w')
            .replace('months', 'mo')
            .replace('month', 'mo')
            .replace('years', 'y')
            .replace('year', 'y');

        const formattedAgoTime = agoTime.replace(/(\d+) (\w+)/, "$1$2");

        return formattedAgoTime.includes('seconds') ? 'Just Now' : formattedAgoTime;
    };


    const { receieverEmail } = useParams()

    return (
        <div className="lg:w-1/3 bg-gradient-to-b from-blue-50 to-white shadow-xl p-6 flex flex-col border-r border-gray-200 rounded-l-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-blue-700 tracking-tight">Chats <span className="text-xs text-gray-500 font-normal">({count ? count : "No New Messages"})</span></h2>
                <button
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-lg transition-colors"
                    aria-label="Start new chat"
                >
                    <FaPlus className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-inner px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                {
                    (users.length > 0) && users.map((user) => {
                        return (
                            <Link key={user.email} to={`/chats/${user.email}`} className={`transition-all duration-200 ${receieverEmail === user.email ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-transparent"} flex items-center gap-3 cursor-pointer border-2 rounded-xl p-3 hover:bg-blue-50 hover:border-blue-300 group shadow-sm`}>
                                <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-blue-200 group-hover:border-blue-400 transition" />
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center ">
                                        <h3 className="text-base font-semibold text-blue-900 truncate">{user ? `${user?.userName || user?.name}` : "Chat"}</h3>
                                        {/* Show unread badge if unreadCount > 0 */}
                                        {user.unreadCount > 0 ? (
                                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full shadow-xl font-bold animate-pulse">
                                                New
                                            </span>
                                        ) : (
                                            user.timestamp ? <p className="text-xs text-gray-400">{timeAgo(user.timestamp)}</p> : <p className="text-xs text-gray-300">No messages yet</p>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm truncate max-w-[180px]">{user?.lastMessage}</p>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ChatSidebar;