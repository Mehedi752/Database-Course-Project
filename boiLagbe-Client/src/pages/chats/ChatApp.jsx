import ChatSidebar from "./ChatSidebar.jsx";
import ChatContainer from "./ChatContainer.jsx";
import { io } from "socket.io-client";
import useAxiosPublic from "../../hooks/useAxiosPublic.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const ADMIN_EMAIL = "mehedihasansagor301@gmail.com";

const ChatApp = () => {
  const { receieverEmail } = useParams();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  // Get sender (current user)
  const { data: sender = {} } = useQuery({
    queryKey: ['currentUser', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  // Get admin user for buyers, or all users for admin
  const { data: users = [], refetch } = useQuery({
    queryKey: ['chatUsers', sender.email],
    queryFn: async () => {
      if (user?.email === ADMIN_EMAIL) {
        // Admin: show all users except self
        const res = await axiosPublic.get(`/users`);
        // For each user, fetch unread count and last message
        const usersWithUnread = await Promise.all(res.data.filter(u => u.email !== ADMIN_EMAIL).map(async (u) => {
          // Fetch unread messages for this user
          const unreadRes = await axiosPublic.get(`/messages?sender=${u._id}&receiver=${sender._id}&unreadOnly=true`);
          // Fetch last message for this user
          const lastMsgRes = await axiosPublic.get(`/messages?sender=${u._id}&receiver=${sender._id}&lastOnly=true`);
          const lastMessageObj = lastMsgRes.data[0];
          return {
            ...u,
            unreadCount: unreadRes.data.length,
            lastMessage: lastMessageObj ? lastMessageObj.text : "",
            timestamp: lastMessageObj ? lastMessageObj.timestamp : ""
          };
        }));
        return usersWithUnread;
      } else {
        // Buyer: only show admin
        const res = await axiosPublic.get(`/users/${ADMIN_EMAIL}`);
        // Fetch unread messages for admin
        const unreadRes = await axiosPublic.get(`/messages?sender=${ADMIN_EMAIL}&receiver=${sender._id}&unreadOnly=true`);
        // Fetch last message for admin
        const lastMsgRes = await axiosPublic.get(`/messages?sender=${ADMIN_EMAIL}&receiver=${sender._id}&lastOnly=true`);
        const lastMessageObj = lastMsgRes.data[0];
        return [{
          ...res.data,
          unreadCount: unreadRes.data.length,
          lastMessage: lastMessageObj ? lastMessageObj.text : "",
          timestamp: lastMessageObj ? lastMessageObj.timestamp : ""
        }];
      }
    },
    enabled: !!sender.email
  });

  // Always set receiver as admin for buyers, or from params for admin
  const receiverEmail = user?.email === ADMIN_EMAIL ? receieverEmail : ADMIN_EMAIL;
  const { data: receiver = {} } = useQuery({
    queryKey: ['currentUser', receiverEmail],
    queryFn: async () => {
      if (!receiverEmail) return {};
      const res = await axiosPublic.get(`/users/${receiverEmail}`);
      return res.data;
    },
    enabled: !!receiverEmail
  });

  const count = users.filter(user => user.unreadCount > 0).length;

  console.log("Sender:", sender);
  console.log("Receiver:", receiver);
  console.log("Users:", users);
  console.log("Count:", count); 

  const socket = io("http://localhost:5000");
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-110px)] bg-gray-100">
      <ChatSidebar users={users} count={count} />
      <ChatContainer refetchChats={refetch} sender={sender} receiver={receiver} socket={socket} />
    </div>
  );
};

export default ChatApp;