import React, { useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const { data: cartItems = [], refetch } = useQuery({
    queryKey: ['cartItems', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cart/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const totalPrice = cartItems.reduce((sum, cart) => sum + (cart.item?.price || 0), 0);
  const payableTotal = Math.max(totalPrice - discount, 0); // Ensure it doesn't go negative


  const handleRemove = async (bookId) => {
    try {
      await axiosPublic.delete(`/cart/${user.email}/${bookId}`);
      toast.success("Item removed from cart");
      refetch();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'DISCOUNT50') {
      setDiscount(50);
      toast.success("Coupon applied! ৳50 discount.");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-300 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="font-medium text-gray-700">Select All ({cartItems.length} Items)</span>
            </label>
            <p className="text-lg font-medium">
              your total:
              <span className="line-through text-red-500 mx-2">৳{(totalPrice + 88).toFixed(2)}</span>
              <span className="text-green-600">৳{totalPrice.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {cartItems.map(cart => (
          <div key={cart.item.bookId} className="bg-white border border-indigo-100 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-center p-5 hover:shadow-2xl transition-all group relative">
            <input type="checkbox" defaultChecked className="self-start mt-2 accent-indigo-500" />
            <div className="w-24 h-32 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl overflow-hidden border border-indigo-100">
              <img src={cart.item.image || 'https://via.placeholder.com/100'} alt={cart.item.title} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-indigo-900 mb-1 truncate" title={cart.item.title}>{cart.item.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{cart.item.author || 'Unknown Author'}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {cart.item.genre && <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">{cart.item.genre}</span>}
                {cart.item.editionYear && <span className="inline-block bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Edition: {cart.item.editionYear}</span>}
              </div>
              <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                <span className="text-indigo-700">৳{cart.item.price}</span>
                <span className="line-through text-red-400 text-base">৳{(cart.item.price + 88).toFixed(0)}</span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(cart.item.bookId)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-2 shadow transition"
              title="Remove from cart"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Summary */}
      <div className="space-y-4 bg-white p-6 border border-gray-300 rounded shadow h-fit">
        <h3 className="text-xl font-bold mb-2">Checkout Summary</h3>

        {/* Coupon Field */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-blue-400"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Apply
          </button>
        </div>

        <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
          <span>Subtotal</span>
          <span>৳{totalPrice.toFixed(0)}</span>
        </div>
        <div className="flex justify-between border-gray-300 border-b pb-2 text-sm">
          <span>Discount</span>
          <span className="text-red-500">– ৳{discount}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>৳{payableTotal}</span>
        </div>
        <div className="text-right text-base font-bold text-green-700 mt-2">
          Payable Total: ৳{payableTotal}
        </div>
        <Link
          to={cartItems.length === 0 ? "#" : "/payment"}
          onClick={e => {
            if (cartItems.length === 0) {
              e.preventDefault();
              toast.error('⛔ Your cart is empty. Please add items before checkout!');
            }
          }}
          className={`w-full block text-center mt-4 px-4 py-2 rounded-lg font-semibold transition-all shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${cartItems.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
