// src/components/Contact.jsx
import React, { useEffect, useState } from 'react'

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`)
        const data = await res.json()

        if (data.success === false) {
          setError(true)
          return
        }

        setLandlord(data)
      } catch (error) {
        setError(true)
      }
    }

    fetchLandlord()
  }, [listing.userRef])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      {error && (
        <p className='text-red-700 text-sm'>Could not load agent contact info</p>
      )}

      {landlord && (
        <div className='flex flex-col gap-3'>
          <p className='text-gray-700'>
            Contact{' '}
            <span className='font-semibold text-brand-navy'>{landlord.username}</span>{' '}
            about{' '}
            <span className='font-semibold text-brand-navy'>{listing.name}</span>
          </p>

          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={handleChange}
            placeholder='Enter your message here...'
            className='w-full border border-gray-300 focus:border-brand-navy focus:outline-none rounded-lg p-3 resize-none transition'
          ></textarea>


            <a href={`mailto:${landlord.email}?subject=${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
            className='bg-brand-green text-white text-center rounded-lg p-3 uppercase hover:bg-brand-greenDark transition'
          >
            Send Message
          </a>
        </div>
      )}
    </>
  )
}