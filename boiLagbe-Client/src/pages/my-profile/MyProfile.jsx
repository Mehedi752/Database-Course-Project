import React from "react";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  if (isLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-indigo-100 p-0">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-3xl px-8 py-8 flex flex-col items-center gap-2">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover mb-2"
          />
          <h2 className="text-2xl font-bold text-white tracking-wide">{user?.displayName || "User"}</h2>
          <span className="bg-white/20 text-indigo-100 px-4 py-1 rounded-full text-sm font-medium mt-1">
            {currentUser?.role === "user" ? "Normal User" : currentUser?.role}
          </span>
        </div>
        <div className="px-8 py-8">
          <div className="mb-6">
            <div className="text-gray-500 text-xs mb-1">Email</div>
            <div className="text-lg font-semibold text-indigo-700 bg-indigo-50 rounded-lg px-4 py-2">{user?.email}</div>
          </div>
          <div className="mb-6">
            <div className="text-gray-500 text-xs mb-1">Joined</div>
            <div className="text-base font-medium text-gray-700 bg-gray-50 rounded-lg px-4 py-2">
              {currentUser?.timestamp
                ? new Date(currentUser.timestamp).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-gray-500 text-xs mb-1">Status</div>
            <div className="text-base font-medium text-green-600 bg-green-50 rounded-lg px-4 py-2 inline-block">
              Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

