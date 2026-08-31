import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaHandshake, FaKey } from 'react-icons/fa'
import heroMan from '../assets/hero-man.png'
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4')
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className='max-w-6xl mx-auto px-3 py-12 flex flex-col-reverse sm:flex-row items-center gap-10'>
        <div className='flex-1 text-center sm:text-left'>
          <h1 className='text-4xl sm:text-5xl font-bold text-brand-navy leading-tight'>
            Find your <span className='text-brand-green'>dream home</span> with the right agent
          </h1>
          <p className='text-gray-600 mt-5 text-lg'>
            AgentHub connects you with trusted local agents so you can buy,
            sell, or rent with total confidence.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 mt-8 justify-center sm:justify-start'>
            <Link
              to='/search'
              className='bg-brand-green text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-brand-greenDark transition text-center'
            >
              Get Started
            </Link>
            <Link
              to='/about'
              className='bg-brand-navy text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-brand-navyLight transition text-center'
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className='flex-1 relative flex justify-center items-center'>
          <div className='absolute w-72 h-72 sm:w-80 sm:h-80 bg-brand-green rounded-full -z-10 top-4 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 opacity-90'></div>
          <div className='absolute w-24 h-24 bg-brand-navy rounded-full -z-10 bottom-0 left-0 opacity-90'></div>
          <div className='absolute w-20 h-20 bg-brand-wood rounded-full -z-10 top-0 right-4 sm:right-0 opacity-90'></div>
          <img
            src={heroMan}
            alt='Happy client using AgentHub'
            className='relative w-64 sm:w-80 h-80 sm:h-96 object-cover rounded-3xl shadow-lg'
          />
        </div>
      </section>

      {/* Listings Sections */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-10 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-end'>
              <h2 className='text-2xl font-semibold text-brand-navy'>Recent offers</h2>
              <Link
                to='/search?offer=true'
                className='text-sm text-brand-green font-medium hover:underline'
              >
                Show more offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-end'>
              <h2 className='text-2xl font-semibold text-brand-navy'>Places for rent</h2>
              <Link
                to='/search?type=rent'
                className='text-sm text-brand-green font-medium hover:underline'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-end'>
              <h2 className='text-2xl font-semibold text-brand-navy'>Places for sale</h2>
              <Link
                to='/search?type=sale'
                className='text-sm text-brand-green font-medium hover:underline'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <section className='bg-white py-16'>
        <div className='max-w-6xl mx-auto px-3'>
          <h2 className='text-3xl font-bold text-brand-navy text-center mb-12'>
            It's so easy to get started
          </h2>
          <div className='grid sm:grid-cols-3 gap-10 text-center'>
            <div className='flex flex-col items-center'>
              <div className='bg-brand-green/10 p-5 rounded-full mb-4'>
                <FaSearch className='text-brand-green text-3xl' />
              </div>
              <h3 className='font-semibold text-lg text-brand-navy mb-2'>Search listings</h3>
              <p className='text-gray-600 text-sm'>
                Browse homes for sale or rent in your area with detailed filters.
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='bg-brand-wood/10 p-5 rounded-full mb-4'>
                <FaHandshake className='text-brand-wood text-3xl' />
              </div>
              <h3 className='font-semibold text-lg text-brand-navy mb-2'>Connect with an agent</h3>
              <p className='text-gray-600 text-sm'>
                Get matched with a trusted local agent who knows the market.
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='bg-brand-navy/10 p-5 rounded-full mb-4'>
                <FaKey className='text-brand-navy text-3xl' />
              </div>
              <h3 className='font-semibold text-lg text-brand-navy mb-2'>Close with confidence</h3>
              <p className='text-gray-600 text-sm'>
                Finalize your deal knowing every step was handled right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className='bg-brand-navy py-16'>
        <div className='max-w-4xl mx-auto px-3 text-center'>
          <h2 className='text-3xl font-bold text-white mb-4'>
            Ready to find your next home?
          </h2>
          <p className='text-gray-200 mb-8'>
            Join AgentHub today and start browsing listings from trusted agents near you.
          </p>
          <Link
            to='/sign-up'
            className='inline-block bg-brand-green text-white px-8 py-3 rounded-lg font-semibold uppercase hover:bg-brand-greenDark transition'
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  )
}