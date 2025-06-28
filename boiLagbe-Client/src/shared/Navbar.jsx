import { Link, NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
// import logoImg from "../assets/logo.png";
import Logo from '../assets/logo-updated.png';
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { BsChatLeftDots } from "react-icons/bs";
import { useCart } from "../hooks/CartContext";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { cartItems } = useCart();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  //   const { data: users = [], } = useQuery({
  //     queryKey: ['chatUsers', currentUser?.email],
  //     queryFn: async () => {
  //       const res = await axiosPublic.get(`/get-chats/${currentUser._id}`);
  //       return res.data;
  //     },
  //   });

  //   const count = users.filter(user => user.isRead).length


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
              All Books
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
                  : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
              }
              to={"/add-books"}
            >
              Add Books
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
                  : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
              }
              to={"/my-added-books"}
            >
              My Added Books
            </NavLink>
          </li>

          {/* {currentUser?.role === "admin" && (
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
                    : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
                }
                to={"/all-claims"}
              >
                All Claims (Admin)
              </NavLink>
            </li>
          )} */}


          {currentUser?.role === "user" && (
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-[#3B82F6] font-bold border-b-4 border-[#3B82F6] focus:outline-none"
                    : "text-white font-medium px-2 py-2 rounded-md hover:text-blue-500 focus:outline-none"
                }
                to={"/my-profile"}
              >
                My Profile
              </NavLink>
            </li>
          )}
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

          

          <div className="navbar-end gap-5">
            <p className="relative">🛒<span className="absolute text-sm bottom-2">({cartItems.length})</span></p>
            {user && user.photoURL ? (
              <div className="relative group">
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />

                <p className="absolute top-8 w-[120px] text-center mt-1 left-1/2 transform -translate-x-1/2 bg-[#1a237e] text-white text-xs font-semibold rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {user.displayName}
                </p>
              </div>
            ) : (
              ""
            )}
            {user && user.email ? ( 
              <button
                onClick={handleLogOut}
                className="btn border-none bg-[#1a237e] hover:bg-blue-700 text-white"
              >
                Logout
              </button>
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