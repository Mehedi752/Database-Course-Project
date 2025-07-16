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
          <div key={cart.item.bookId} className="bg-cyan-50 border border-gray-300 p-4 rounded shadow flex flex-col md:flex-row gap-4 items-center">
            <input type="checkbox" defaultChecked className="self-start mt-2" />
            <img src={cart.item.image || "https://via.placeholder.com/100"} alt={cart.item.title} className="w-24 h-32 object-cover rounded" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">{cart.item.title}</h3>
              <p className="text-sm text-gray-600">{cart.item.author || "Unknown Author"}</p>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-gray-700">৳{cart.item.price}</span>
                <span className="line-through text-red-400 text-base">৳{(cart.item.price + 88).toFixed(0)}</span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(cart.item.bookId)}
              className="text-red-500 hover:text-red-700 transition"
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
          to={'/payment'}
          state={{ totalPrice, discount, payableTotal }}
          className="w-full btn bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          অর্ডারটি নিশ্চিত করুন →
        </Link>
      </div>
    </div>
  );
};

export default Cart;
