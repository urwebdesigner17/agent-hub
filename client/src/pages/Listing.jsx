// src/pages/Listing.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from 'react-icons/fa'
import Contact from '../components/Contact'

export default function Listing() {
  SwiperCore.use([Navigation])
  const params = useParams()
  const { currentUser } = useSelector((state) => state.user)

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        setError(false)

        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json()

        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }

        setListing(data)
        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.listingId])

  return (
    <main>
      {loading && (
        <p className='text-center my-7 text-2xl text-brand-navy'>Loading...</p>
      )}
      {error && (
        <p className='text-center my-7 text-2xl text-red-700'>
          Something went wrong loading this listing
        </p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[400px] sm:h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className='max-w-4xl mx-auto p-4 flex flex-col gap-4 my-7'>
            <p className='text-2xl font-semibold text-brand-navy'>
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>

            <p className='flex items-center gap-2 text-gray-600 text-sm'>
              <FaMapMarkerAlt className='text-brand-wood' />
              {listing.address}
            </p>

            <div className='flex gap-4'>
              <p className='bg-brand-navy text-white text-center px-3 py-1 rounded-md text-sm uppercase'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-brand-green text-white text-center px-3 py-1 rounded-md text-sm uppercase'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className='text-gray-700'>
              <span className='font-semibold text-brand-navy'>Description - </span>
              {listing.description}
            </p>

            <ul className='text-brand-navy font-medium text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-lg text-brand-wood' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-lg text-brand-wood' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-lg text-brand-wood' />
                {listing.parking ? 'Parking spot' : 'No parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-lg text-brand-wood' />
                {listing.furnished ? 'Furnished' : 'Not furnished'}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !showContact && (
              <button
                onClick={() => setShowContact(true)}
                className='bg-brand-navy text-white rounded-lg p-3 uppercase hover:bg-brand-navyLight transition'
              >
                Contact the Agent
              </button>
            )}

            {showContact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  )
}