import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../error/ErrorPage";
import About from "../pages/about/About";
import Home from "../pages/home/Home";
import Contact from "../pages/contact/Contact";
import Register from "../auth/Register";
import Login from "../auth/Login";
import AddBooks from "../pages/add-books/AddBooks";
import Books from "../pages/books/Books";
import MyAddedBooks from "../pages/my-added-books/MyAddedBooks";
import UpdateBook from "../pages/update-book/UpdateBook";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact/>
      },
      {
        path: "/auth/register",
        element: <Register></Register>,
      },
      {
        path: "/auth/login",
        element: <Login></Login>,
      },
      {
        path: "/add-books",
        element: <AddBooks></AddBooks>
      },
      {
        path: "/books",
        element: <Books></Books>
      },
    //   {
    //     path: "/posts/:id",
    //     element: <PrivateRoute><PostDetails></PostDetails></PrivateRoute>,
    //   },
      {
        path: '/my-added-books',
        element: <MyAddedBooks></MyAddedBooks>
      },
    //   {
    //     path: '/claim-item',
    //     element: <ClaimItem></ClaimItem>
    //   },
    //   {
    //     path: '/all-claims',
    //     element: <PrivateAdmin><AllClaims /></PrivateAdmin>
    //   },
    //   {
    //     path: '/my-claims',
    //     element: <MyClaims />
    //   },
    //   {
    //     path: '/my-profile',
    //     element: <MyProfile></MyProfile>
    //   },
    //   {
    //     path: '/claim-details/:id',
    //     element: <ClaimDetails />
    //   },
      {
        path: '/books/update/:id',
        element: <UpdateBook></UpdateBook>
      },
    //   {
    //     path: '/donation',
    //     element: <Donation></Donation>
    //   },
    //   {
    //     path: '/success',
    //     element: <SuccessPaymentModal></SuccessPaymentModal>
    //   },
    //   {
    //     path: '/feedbacks',
    //     element: <Feedbacks></Feedbacks>
    //   },
    ],
  },
//   {
//     path: "/chats",
//     element: <ChatLayout></ChatLayout>,
//     errorElement: <ErrorPage></ErrorPage>,
//     children: [
//       {
//         path: '/chats',
//         element: <ChatApp></ChatApp>
//       },
//       {
//         path: '/chats/:receieverEmail',
//         element: <ChatApp></ChatApp>
//       },
//     ],
//   },
]);

export default router;