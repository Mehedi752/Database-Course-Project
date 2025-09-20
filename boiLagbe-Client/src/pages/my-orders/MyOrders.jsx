import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['myOrders', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Animated Loader Component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
      <span className="text-indigo-700 font-semibold text-lg tracking-wide animate-pulse">Loading your orders...</span>
    </div>
  );

  // Inject demo data if no orders and not loading
  const demoOrders = [
    {
      _id: 'demo1',
      bookImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=facearea&w=200&q=80',
      bookTitle: 'The Art of Clean Code',
      bookAuthor: 'Robert C. Martin',
      orderDate: new Date().toISOString(),
      price: 499,
      status: 'Delivered',
      bookId: '1',
    },
    {
      _id: 'demo2',
      bookImage: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=facearea&w=200&q=80',
      bookTitle: 'React Mastery',
      bookAuthor: 'Dan Abramov',
      orderDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      price: 299,
      status: 'Pending',
      bookId: '2',
    },
  ];
  const displayOrders = !isLoading && orders.length === 0 ? demoOrders : orders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-2 md:px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-10 text-center tracking-tight">My Recent Orders</h1>
        {isLoading ? (
          <Loader />
        ) : displayOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img src="https://cdn.dribbble.com/users/2046015/screenshots/6012385/empty-state.png" alt="No Orders" className="w-56 mb-6 opacity-80" />
            <p className="text-gray-500 text-lg mb-2">You have not placed any orders yet.</p>
            <Link to="/books" className="btn btn-primary mt-2">Browse Books</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayOrders.map(order => (
              <div key={order._id} className="bg-white/90 rounded-2xl shadow-xl border border-indigo-100 flex flex-col md:flex-row items-center md:items-stretch gap-6 p-6 md:p-8 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="flex-shrink-0 flex items-center justify-center">
                  <img src={order.bookImage || 'https://via.placeholder.com/60'} alt={order.bookTitle} className="w-20 h-28 object-cover rounded-xl border border-indigo-100 shadow group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="font-bold text-lg md:text-xl text-indigo-900 mb-1 truncate">{order.bookTitle}</div>
                    <div className="text-xs text-gray-500 mb-2">by {order.bookAuthor || 'Unknown Author'}</div>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600"><span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}</span>
                      <span className="inline-flex items-center gap-1 text-sm text-green-700 font-bold">৳{order.price?.toFixed(2)}</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end min-w-[100px]">
                  <button className="btn btn-outline btn-primary btn-sm md:btn-md font-semibold transition-transform duration-200 group-hover:scale-105">View</button>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-indigo-200 via-blue-200 to-transparent" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
