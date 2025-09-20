import React, { useEffect, useState } from 'react';

const CouponCards = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/coupons')
      .then(res => res.json())
      .then(data => {
        setCoupons(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center py-10">Loading coupons...</div>;
  if (!coupons.length) return null;

  return (
    <section className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">🎁 Special Coupons</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {coupons.map(coupon => (
          <div
            key={coupon._id}
            className="relative bg-gradient-to-br from-white via-indigo-50 to-blue-100 border border-indigo-200 rounded-3xl shadow-2xl px-7 pt-8 pb-7 flex flex-col items-center group overflow-visible transition-transform duration-300 hover:scale-105"
            style={{ minHeight: 270 }}
          >
            {/* Discount Ribbon */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold px-7 py-2 rounded-full shadow-lg text-lg tracking-wider border-4 border-white">
                {coupon.discount}% OFF
              </div>
            </div>
            {/* Perforated edge */}
            <div className="absolute left-0 right-0 top-16 h-0.5 border-b-2 border-dotted border-indigo-200 opacity-70 z-10"></div>
            {/* Coupon icon */}
            <div className="text-5xl mb-2 mt-6 text-indigo-400 drop-shadow">🏷️</div>
            <div className="text-xl font-bold text-indigo-900 mb-1 text-center">{coupon.title || coupon.code}</div>
            <div className="text-gray-600 text-center mb-3 line-clamp-2">{coupon.description}</div>
            {/* Coupon code highlight */}
            <div className="w-full flex flex-col items-center mt-2">
              <span className="text-xs text-gray-500 mb-1">Coupon Code</span>
              <span className="font-mono text-lg bg-gradient-to-r from-indigo-100 to-blue-100 px-6 py-2 rounded-xl border-2 border-indigo-300 text-indigo-700 tracking-widest shadow-inner select-all transition hover:bg-indigo-50 hover:border-indigo-500">
                {coupon.code}
              </span>
            </div>
            {coupon.expiry && (
              <div className="text-xs text-red-500 mt-4 font-semibold">
                Expires: {new Date(coupon.expiry).toLocaleDateString()}
              </div>
            )}
              </div>
        ))}
      </div>
    </section>
  );
};

export default CouponCards;
