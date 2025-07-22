import React, { useState } from 'react'
import useAxiosPublic from '../../hooks/useAxiosPublic'
import useAuth from '../../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
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

  const handleOrderConfirm = async () => {
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
    } else if (paymentMethod === 'wallet') {
      if (
        walletType &&
        transactionId.length >= 12 &&
        transactionId.length <= 18
      ) {
        await axiosPublic.post('/confirm-payment', {
          email: user?.email,
          paymentMethod,
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
        <div className='bg-white border border-gray-300 p-4 rounded shadow space-y-4'>
          <h2 className='text-lg font-semibold text-gray-700'>
            Payment Method{' '}
            <span className='text-xs text-gray-500'>
              (Please select a payment method)
            </span>
          </h2>

          {/* Cash on Delivery */}
          <div>
            <p className='font-semibold text-gray-800 mb-1'>
              💵 ক্যাশ অন ডেলিভারি
            </p>
            <p className='text-sm text-gray-500 mb-2'>
              পণ্য হাতে পেয়ে টাকা পরিশোধ করুন
            </p>
            <label className='flex items-center gap-2 border p-3 rounded cursor-pointer border-blue-400 bg-blue-50'>
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
              <span className='text-blue-800 font-medium'>
                ক্যাশ অন ডেলিভারি
              </span>
            </label>
          </div>

          {/* Mobile Wallets */}
          <div>
            <p className='font-semibold text-gray-800 mt-4 mb-1'>
              📱 মোবাইল ওয়ালেট
            </p>
            <p className='text-sm text-gray-500 mb-2'>
              মোবাইল ওয়ালেট থেকে অগ্রিম টাকা পরিশোধ করুন
            </p>
            <div className='flex gap-4'>
              {[
                { name: 'bKash', logo: bkashLogo },
                { name: 'Nagad', logo: nagadLogo },
                { name: 'Rocket', logo: rocketLogo }
              ].map(wallet => (
                <label
                  key={wallet.name}
                  className={`flex flex-col items-center gap-1 border rounded p-2 w-24 cursor-pointer ${
                    walletType === wallet.name
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type='radio'
                    name='wallet'
                    checked={walletType === wallet.name}
                    onChange={() => handleWalletSelect(wallet.name)}
                  />
                  <img src={wallet.logo} alt={wallet.name} className='h-8' />
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
                  className='w-full px-4 py-2 border border-gray-200 rounded focus:outline-blue-500'
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
        </div>

        <button
          onClick={handleOrderConfirm}
          className='w-[300px] mx-auto btn bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition'
        >
          অর্ডার নিশ্চিত করুন ৳{payableTotal.toFixed(0)}
        </button>
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
    </div>
  )
}

export default Payment
