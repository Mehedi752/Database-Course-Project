import React, { useState } from 'react'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import useAuth from '../../hooks/useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import bkashLogo from '../../assets/bkash.png'
import nagadLogo from '../../assets/nagad.png'
import rocketLogo from '../../assets/rocket.png'
import { toast } from 'react-toastify'

const Payment = () => {
  const axiosPublic = useAxiosPublic()
  const { user } = useAuth()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [walletType, setWalletType] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const queryClient = useQueryClient()
  let paymentOkay = false;

  const {
    totalPrice = 0,
    discount = 0,
    payableTotal = 0
  } = location.state || {}

  const { data: cartItems = [], refetch } = useQuery({
    queryKey: ['cartItems', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/cart/${user?.email}`)
      return res.data
    },
    enabled: !!user?.email
  })

  const handleWalletSelect = wallet => {
    setWalletType(wallet)
    setPaymentMethod('wallet')
    setTransactionId('')
  }

  const handlePaymentSuccess = async (paymentInfo) => {
    // Save order to backend
    try {
      await axiosPublic.post('/orders', {
        userEmail: user.email,
        cart: cartItems,
        payment: paymentInfo,
        orderDate: new Date().toISOString(),
        status: 'Paid'
      });
      // Optionally clear cart here
      // Show success toast
      // toast.success('Order placed successfully!');
      // Redirect or update UI as needed
    } catch (err) {
      toast.error('Failed to save order. Please contact support.');
    }
  };

  const handleOrderConfirm = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('⛔ Your cart is empty. Please add items before ordering!');
      return;
    }
  
    if (paymentMethod === 'cod') {
      await axiosPublic.post('/confirm-payment', {
        email: user?.email,
        paymentMethod,
        transactionId,
        amount: payableTotal
      })
      toast.success(
        '🛵 আপনার ক্যাশ অন ডেলিভারি অর্ডারটি সফলভাবে নিশ্চিত হয়েছে। অনুগ্রহ করে বিস্তারিত তথ্যের জন্য আপনার কনফার্মেশন ইমেইল চেক করুন।',
        {
          duration: 4000,
          icon: '💸'
        }
      )
      paymentOkay = true;
      queryClient.invalidateQueries(['cartItems'])
      handlePaymentSuccess({ paymentMethod, transactionId, amount: payableTotal });
    } else if (paymentMethod === 'wallet') {
      if (
        walletType &&
        transactionId.length >= 12 &&
        transactionId.length <= 18
      ) {
        await axiosPublic.post('/confirm-payment', {
          email: user?.email,
          paymentMethod: walletType,
          transactionId,
          amount: payableTotal
        })
        toast.success(
          `আপনার ✅${walletType} পেমেন্ট সফল হয়েছে! অনুগ্রহ করে বিস্তারিত তথ্যের জন্য আপনার কনফার্মেশন ইমেইল চেক করুন।`,
          {
            duration: 4000,
            icon: '📱'
          }
        )
        queryClient.invalidateQueries(['cartItems'])
        handlePaymentSuccess({ paymentMethod: walletType, transactionId, amount: payableTotal });
      } else {
        toast.error('⛔দয়া করে ১২ থেকে ১৮ সংখ্যার ট্রানজেকশন আইডি দিন!', {
          duration: 4000
        })
      }
    } else {
      toast.error('⛔দয়া করে আগে একটি পেমেন্ট মেথড নির্বাচন করুন!')
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2 space-y-6'>
        {/* Payment Section */}
        <div className='bg-white border border-indigo-100 p-8 rounded-3xl shadow-xl space-y-8'>
          <h2 className='text-2xl font-bold text-indigo-800 mb-2 flex items-center gap-2'>
            Payment Method
            <span className='text-xs text-gray-500 font-normal'>(Please select a payment method)</span>
          </h2>

          {/* Cash on Delivery */}
          <div>
            <p className='font-semibold text-gray-800 mb-1'>💵 ক্যাশ অন ডেলিভারি</p>
            <p className='text-sm text-gray-500 mb-2'>পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
            <label className={`flex items-center gap-2 border p-3 rounded-xl cursor-pointer ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
              <input
                type='radio'
                name='payment'
                value='cod'
                checked={paymentMethod === 'cod'}
                onChange={() => {
                  setPaymentMethod('cod')
                  setWalletType('')
                  setTransactionId('')
                }}
              />
              <span className='text-blue-800 font-medium'>ক্যাশ অন ডেলিভারি</span>
            </label>
          </div>

          {/* Mobile Wallets */}
          <div>
            <p className='font-semibold text-gray-800 mt-4 mb-1'>📱 মোবাইল ওয়ালেট</p>
            <p className='text-sm text-gray-500 mb-2'>মোবাইল ওয়ালেট থেকে অগ্রিম টাকা পরিশোধ করুন</p>
            <div className='flex gap-4'>
              { [
                { name: 'bKash', logo: bkashLogo },
                { name: 'Nagad', logo: nagadLogo },
                { name: 'Rocket', logo: rocketLogo }
              ].map(wallet => (
                <label
                  key={wallet.name}
                  className={`flex flex-col items-center gap-1 border rounded-xl p-3 w-28 cursor-pointer transition-all duration-200 ${walletType === wallet.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <input
                    type='radio'
                    name='wallet'
                    checked={walletType === wallet.name}
                    onChange={() => handleWalletSelect(wallet.name)}
                  />
                  <img src={wallet.logo} alt={wallet.name} className='h-8' />
                  <span className='text-xs font-semibold text-gray-700'>{wallet.name}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'wallet' && (
              <div className='mt-4 space-y-2'>
                <input
                  type='text'
                  placeholder={`Enter your ${walletType} Transaction ID`}
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className='w-full px-4 py-2 border border-indigo-200 rounded focus:outline-indigo-500'
                />
                {transactionId &&
                  (transactionId.length < 12 || transactionId.length > 18) && (
                    <p className='text-sm text-red-500 mt-1'>
                      ট্রানজেকশন আইডি অবশ্যই ১২ থেকে ১৮ অক্ষরের মধ্যে হতে হবে
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* Bank Payment */}
          <div>
            <p className='font-semibold text-gray-800 mt-4 mb-1'>🏦 ব্যাংক পেমেন্ট</p>
            <p className='text-sm text-gray-500 mb-2'>আপনার ব্যাংক অ্যাকাউন্ট থেকে পেমেন্ট করুন (Manual verification)</p>
            <label className={`flex items-center gap-2 border p-3 rounded-xl cursor-pointer ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
              <input
                type='radio'
                name='payment'
                value='bank'
                checked={paymentMethod === 'bank'}
                onChange={() => {
                  setPaymentMethod('bank')
                  setWalletType('')
                  setTransactionId('')
                }}
              />
              <span className='text-blue-800 font-medium'>ব্যাংক পেমেন্ট</span>
            </label>
            {paymentMethod === 'bank' && (
              <div className='mt-4 space-y-2 bg-indigo-50 rounded-xl p-4 border border-indigo-100'>
                {/* Professional Bank Details Card */}
                <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl border border-blue-200 p-8 mb-8 flex flex-col items-center animate-fade-in">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mr-2">Bank Details</span>
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" /></svg>
                  </h2>
                  <div className="w-full space-y-3 text-blue-900 text-base font-medium">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <span>Bank Name:</span>
                      <span className="font-bold text-blue-700">ABC Bank Ltd.</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <span>Account Name:</span>
                      <span className="font-bold text-blue-700">BoiLagbe Marketplace</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <span>Account Number:</span>
                      <span className="font-mono text-blue-800">1234 5678 9012 3456</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <span>Branch:</span>
                      <span className="text-blue-700">Dhaka Main</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Routing Number:</span>
                      <span className="text-blue-700">987654321</span>
                    </div>
                  </div>
                </div>

                <input
                  type='text'
                  placeholder='Enter your Bank Transaction/Reference ID'
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className='w-full px-4 py-2 border border-indigo-200 rounded focus:outline-indigo-500'
                />
                {transactionId && transactionId.length < 8 && (
                  <p className='text-sm text-red-500 mt-1'>
                    Reference ID অবশ্যই ৮ অক্ষরের বেশি হতে হবে
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {
          paymentOkay ? (
            <div className='bg-green-50 border border-green-200 p-4 rounded shadow text-center'>
              <h2 className='text-lg font-semibold text-green-700'>
                আপনার অর্ডার সফলভাবে নিশ্চিত হয়েছে!
              </h2>
              <p className='text-sm text-green-600 mt-2'>
                ধন্যবাদ! আপনার অর্ডারটি প্রক্রিয়াধীন রয়েছে। বিস্তারিত তথ্যের জন্য
                আপনার ইমেইল চেক করুন।
              </p>
            </div>
          ) :  (
              <button
                onClick={handleOrderConfirm}
                className='w-[300px] mx-auto btn bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition'
              >
                অর্ডার নিশ্চিত করুন ৳{payableTotal.toFixed(0)}
              </button>)
        }
      </div>

      {/* Checkout Summary */}
      <div className='space-y-4 bg-white p-6 border border-gray-300 rounded shadow h-fit'>
        <h3 className='text-xl font-bold mb-2'>Checkout Summary</h3>
        <div className='flex justify-between border-b border-b-gray-200 pb-2 text-sm'>
          <span>Subtotal</span>
          <span>৳{totalPrice.toFixed(0)}</span>
        </div>
        <div className='flex justify-between border-b border-b-gray-200 pb-2 text-sm'>
          <span>Discount</span>
          <span>৳{discount}</span>
        </div>
        <div className='flex justify-between border-b border-b-gray-200 pb-2 text-sm'>
          <span>Total</span>
          <span>৳{payableTotal}</span>
        </div>
        <div className='text-green-700 mt-2 text-center text-sm font-medium'>
          You are saving ৳
          {(totalPrice + 88 - payableTotal + discount).toFixed(2)} on this
          order!
        </div>
      </div>
    </div >
  )
}

export default Payment
