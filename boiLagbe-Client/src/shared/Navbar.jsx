import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import logoImg from "../assets/logo.png";
import Logo from '../assets/logo-updated.png';
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { BsChatLeftDots } from "react-icons/bs";

const Navbar = () => {
  const { user, signOutUser} = useAuth();
  const axiosPublic = useAxiosPublic();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  const { data: cartItems } = useQuery({
    queryKey: ['cartItems', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cart/${user?.email}`);
      return res.data;
    },
  });
  console.log(cartItems)

  // Get unread chat count for notification badge
  const { data: unreadChatCount = 0 } = useQuery({
    queryKey: ['unreadChatCount', user?.email],
    queryFn: async () => {
      if (!user?.email) return 0;
      // Use the same logic as in ChatApp.jsx
      const ADMIN_EMAIL = "mehedihasansagor301@gmail.com";
      const res = await axiosPublic.get(`/users/${user?.email}`);
      const sender = res.data;
      if (!sender || !sender._id) {
        console.warn('User _id missing for unread chat count');
        return 0;
      }
      if (user?.email === ADMIN_EMAIL) {
        const usersRes = await axiosPublic.get(`/users`);
        const users = usersRes.data.filter(u => u.email !== ADMIN_EMAIL);
        let total = 0;
        for (const u of users) {
          if (!u._id) continue;
          const unreadRes = await axiosPublic.get(`/messages?sender=${u._id}&receiver=${sender._id}&unreadOnly=true`);
          if (unreadRes.data.length > 0) total++;
        }
        return total;
      } else {
        const unreadRes = await axiosPublic.get(`/messages?sender=${ADMIN_EMAIL}&receiver=${sender._id}&unreadOnly=true`);
        return unreadRes.data.length > 0 ? 1 : 0;
      }
    },
    enabled: !!user?.email
  });

  const links = (
    <>
      <li>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
              : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
          }
          to={"/"}
        >
          Home
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
                  : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
              }
              to={"/books"}
            >
              Browse Books
            </NavLink>
          </li>
        </>
      )}
      <li>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
              : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
          }
          to={"/about"}
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
              : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
          }
          to={"/contact"}
        >
          Contact
        </NavLink>
      </li>
      <li>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
              : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
          }
          to={"/feedbacks"}
        >
          Feedbacks
        </NavLink>
      </li>
    </>
  );


  const handleLogOut = () => {
    signOutUser()
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className=" sticky top-0 left-0 w-full z-50 bg-[#1E1E2E] text-white py-5">
      <div className="container mx-auto">
        <div className="navbar flex items-center">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-[#1e1e2d] rounded-box z-[1] mt-3 w-fit items-center px-6 py-2 border border-white/50 shadow"
              >
                {links}
              </ul>
            </div>

            <Link to="/" className="flex items-center gap-1">
              <img src={Logo} alt="" className="w-12 h-12 mt-2" />
              <h3 className="text-2xl">BoiLagbe</h3>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className="navbar-end gap-3">
            <Link to={"/cart"} className="mr-3">
              <p className="relative">🛒<span className="absolute text-sm bottom-2">({cartItems?.length})</span></p>
            </Link>
            <Link to={"/chats"} className="relative flex items-center justify-center">
              <BsChatLeftDots className="w-7 h-7 text-blue-400 hover:text-blue-600 transition" title="Chat" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {unreadChatCount}
                </span>
              )}
            </Link>
            {user && user.photoURL ? (
              <div className="relative">
                <button
                  className="focus:outline-none"
                  tabIndex={0}
                  onClick={e => {
                    const dropdown = document.getElementById('profile-dropdown');
                    if (dropdown) dropdown.classList.toggle('hidden');
                  }}
                >
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-blue-500 shadow-md hover:scale-105 transition-transform"
                  />
                </button>
                {/* Dropdown Card */}
                <div
                  id="profile-dropdown"
                  className="hidden absolute right-0 mt-3 w-56 bg-white border border-blue-100 rounded-xl shadow-xl z-50 py-2 flex flex-col animate-fade-in"
                  onBlur={e => e.currentTarget.classList.add('hidden')}
                  tabIndex={-1}
                >
                  <div className="flex items-center gap-1 px-4 py-3 border-b border-blue-50">
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-400 shadow" />
                    <span className="text-indigo-700 font-semibold text-base break-all">{user.displayName}</span>
                  </div>
                  {/* My Profile for normal user */}
                  {currentUser?.role === "user" && (
                    <Link to="/my-profile" className="px-4 py-2 hover:bg-blue-50 text-gray-800 flex items-center gap-2 transition">
                      <span>🙍‍♂️</span> My Profile
                    </Link>
                  )}
                  <Link to="/my-added-books" className="px-4 py-2 hover:bg-blue-50 text-gray-800 flex items-center gap-2 transition">
                    <span>📚</span> My Added Books
                  </Link>
                  <Link to="/my-orders" className="px-4 py-2 hover:bg-blue-50 text-gray-800 flex items-center gap-2 transition">
                    <span>🛍️</span> My Orders
                  </Link>
                  <Link to="/add-books" className="px-4 py-2 hover:bg-blue-50 text-gray-800 flex items-center gap-2 transition">
                    <span>➕</span> Add Book
                  </Link>
                  {/* Admin Coupon Form Link */}
                  {currentUser?.role === "admin" && (
                    <Link to="/admin-coupons" className="px-4 py-2 hover:bg-blue-50 text-gray-800 flex items-center gap-2 transition">
                      <span>🏷️</span> Admin Coupon
                    </Link>
                  )}
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition border-t border-blue-50 mt-1"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to={"/auth/login"}
                className="btn bg-[#1a237e] border-none hover:bg-blue-700 text-white"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Navbar;