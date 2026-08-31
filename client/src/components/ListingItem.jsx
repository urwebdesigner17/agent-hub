// src/components/ListingItem.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa'

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden w-full sm:w-[300px]'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative'>
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className='h-52 w-full object-cover hover:scale-105 transition-transform duration-300'
          />
          {listing.offer && (
            <span className='absolute top-3 left-3 bg-brand-green text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase'>
              Discount
            </span>
          )}
          <span className='absolute top-3 right-3 bg-brand-navy text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase'>
            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        <div className='p-4 flex flex-col gap-2'>
          <p className='truncate text-lg font-semibold text-brand-navy'>
            {listing.name}
          </p>

          <div className='flex items-center gap-1 text-gray-500 text-sm'>
            <FaMapMarkerAlt className='text-brand-wood' />
            <p className='truncate'>{listing.address}</p>
          </div>

          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description}
          </p>

          <p className='text-brand-navy font-semibold'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>

          <div className='flex gap-4 text-brand-navy text-sm font-medium'>
            <div className='flex items-center gap-1'>
              <FaBed className='text-brand-wood' />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className='flex items-center gap-1'>
              <FaBath className='text-brand-wood' />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}