import React, { useState } from 'react';

const AdminAddCoupon = () => {
  const [form, setForm] = useState({ title: '', code: '', discount: '', description: '', expiry: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!form.code || !form.discount) {
      setError('Code and Discount are required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess('Coupon added successfully!');
        setForm({ title: '', code: '', discount: '', description: '', expiry: '' });
      } else {
        setError('Failed to add coupon.');
      }
    } catch {
      setError('Server error.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-indigo-200 p-0 relative overflow-hidden">
        {/* Decorative Icon */}
        <div className="absolute -top-8 right-8 z-10 opacity-10 pointer-events-none">
          <svg width="96" height="96" fill="none" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="48" fill="#6366F1" />
            <text x="50%" y="54%" textAnchor="middle" fill="#fff" fontSize="40" fontWeight="bold" dy=".3em">%</text>
          </svg>
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-500 rounded-t-3xl px-10 py-7 flex items-center gap-4 shadow">
          <span className="inline-flex items-center justify-center bg-white/20 rounded-full p-3 shadow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l2-2 4 4m0 0l-4-4-2 2m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-wide">Create Coupon</h2>
            <p className="text-indigo-100 text-sm mt-1">Boost your sales with a new discount code</p>
          </div>
        </div>
        {/* Divider */}
        <div className="h-2 bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-100" />
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-10 py-10">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Title <span className="text-gray-400 text-sm">(optional)</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 px-4 py-2.5 transition text-lg"
              placeholder="e.g. Summer Sale"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Coupon Code <span className="text-red-500">*</span></label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 px-4 py-2.5 font-mono tracking-wider uppercase text-lg transition"
              placeholder="e.g. SAVE20"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-base font-semibold text-gray-700 mb-1">Discount (%) <span className="text-red-500">*</span></label>
              <input
                name="discount"
                type="number"
                min="1"
                max="100"
                value={form.discount}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 px-4 py-2.5 text-lg transition"
                placeholder="e.g. 15"
              />
            </div>
            <div className="flex-1">
              <label className="block text-base font-semibold text-gray-700 mb-1">Expiry Date</label>
              <input
                name="expiry"
                type="date"
                value={form.expiry}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 px-4 py-2.5 text-lg transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 bg-gray-50 px-4 py-2.5 text-lg transition resize-none"
              placeholder="Describe the coupon (optional)"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Adding...
              </span>
            ) : 'Add Coupon'}
          </button>
          {(success || error) && (
            <div className="mt-4">
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-center font-semibold shadow">
                  {success}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-center font-semibold shadow">
                  {error}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminAddCoupon;
