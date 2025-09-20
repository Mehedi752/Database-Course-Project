import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosPublic from '../axiosPublic';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPublic.get(`/orders/${user.email}`);
        setOrders(res.data);
      } catch (err) {
        toast.error('Failed to fetch orders');
      }
    };
    if (user?.email) fetchOrders();
  }, [user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Items</th>
              <th className="py-3 px-6 text-left">Payment Method</th>
              <th className="py-3 px-6 text-left">Transaction ID</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-medium">
            {orders.map((order, idx) => (
              <tr key={order._id}>
                <td>{idx + 1}</td>
                <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}</td>
                <td>
                  {order.cart && order.cart.map((item, i) => (
                    <div key={i} className="mb-1">
                      <span className="font-semibold">{item.title}</span> <span className="text-xs text-gray-500">({item.author})</span>
                    </div>
                  ))}
                </td>
                <td>{order.payment?.method || '-'}</td>
                <td>{order.payment?.transactionId || '-'}</td>
                <td className="font-bold text-green-700">৳{order.cart?.reduce((sum, b) => sum + (b.finalPrice || 0), 0).toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;