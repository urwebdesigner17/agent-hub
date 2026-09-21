// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user)

  const [userListings, setUserListings] = useState([])
  const [showListingsError, setShowListingsError] = useState(false)
  const [listingsLoading, setListingsLoading] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setShowListingsError(false)
        setListingsLoading(true)

        const res = await fetch(`/api/user/listings/${currentUser._id}`)
        const data = await res.json()

        if (data.success === false) {
          setShowListingsError(true)
          setListingsLoading(false)
          return
        }

        setUserListings(data)
        setListingsLoading(false)
      } catch (error) {
        setShowListingsError(true)
        setListingsLoading(false)
      }
    }

    fetchListings()
  }, [currentUser._id])

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <div className='flex flex-col lg:flex-row gap-8 mt-4'>

        {/* LEFT: Listings management */}
        <div className='flex-1 order-2 lg:order-1'>
          <div className='flex justify-between items-center mb-5'>
            <h2 className='text-2xl font-semibold text-brand-navy'>Your Listings</h2>
            <Link
              to='/create/listing'
              className='bg-brand-green text-white text-sm font-medium uppercase px-4 py-2.5 rounded-lg hover:bg-brand-greenDark transition'
            >
              Add Listing
            </Link>
          </div>

          {listingsLoading && (
            <p className='text-brand-navy text-center py-10'>Loading listings...</p>
          )}

          {showListingsError && (
            <p className='text-red-700 text-center py-10'>
              Error loading listings, please try again
            </p>
          )}

          {!listingsLoading && !showListingsError && userListings.length === 0 && (
            <p className='text-gray-500 text-center py-10'>
              You haven't created any listings yet.
            </p>
          )}

          <div className='flex flex-col gap-4'>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-4'
              >
                <Link to={`/listing/${listing._id}`} className='flex items-center gap-4 flex-1 min-w-0'>
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className='h-16 w-16 object-cover rounded-lg flex-shrink-0'
                  />
                  <p className='text-brand-navy font-medium truncate hover:underline'>
                    {listing.name}
                  </p>
                </Link>

                <div className='flex flex-col gap-1 text-sm flex-shrink-0'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-700 hover:underline'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-brand-green hover:underline'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: About the agent */}
        <div className='w-full lg:w-80 order-1 lg:order-2'>
          <div className='border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center gap-3 sticky top-24'>
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className='w-28 h-28 rounded-full object-cover border-4 border-brand-wood'
            />
            <h1 className='text-xl font-semibold text-brand-navy'>{currentUser.username}</h1>
            <p className='text-sm text-brand-green font-medium'>{currentUser.title}</p>
            <p className='text-sm text-gray-500'>{currentUser.email}</p>

            {currentUser.bio && (
              <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
                {currentUser.bio}
              </p>
            )}

            <Link
              to='/profile'
              className='w-full mt-4 border border-brand-navy text-brand-navy rounded-lg py-2.5 text-sm font-medium uppercase hover:bg-brand-navy hover:text-white transition'
            >
              Update Profile
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}