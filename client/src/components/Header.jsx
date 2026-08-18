import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())

      const res = await fetch('/api/auth/sign-out')
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }

      dispatch(signOutUserSuccess())
      navigate('/')
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  return (
    <header className='bg-white shadow-md sticky top-0 z-40'>
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-4'>
        {/* Logo */}
        <Link to='/'>
          <h1 className='font-bold text-2xl sm:text-3xl flex flex-wrap tracking-tight'>
            <span className='text-brand-navy'>Agent</span>
            <span className='text-brand-green'>Hub</span>
          </h1>
        </Link>

        {/* Search bar */}
        <form className='bg-gray-100 px-4 py-2.5 rounded-full flex items-center w-40 sm:w-72 transition focus-within:ring-2 focus-within:ring-brand-green/50'>
          <FaSearch className='text-brand-wood' />
          <input
            className='bg-transparent focus:outline-none w-full ml-2 text-sm'
            type='text'
            placeholder='Search...'
          />
        </form>

        {/* Nav menu */}
        <ul className='flex items-center gap-6'>
          <Link to='/'>
            <li className='hidden sm:inline text-brand-navy font-medium hover:text-brand-green transition'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-brand-navy font-medium hover:text-brand-green transition'>
              About
            </li>
          </Link>

          {currentUser ? (
            <li className='relative group'>
              <img
                className='rounded-full h-9 w-9 object-cover border-2 border-brand-wood cursor-pointer'
                src={currentUser.avatar}
                alt='profile'
              />

              {/* Dropdown */}
              <div className='absolute right-0 top-full pt-2 hidden group-hover:block'>
                <div className='bg-white rounded-lg shadow-lg border border-gray-100 w-44 overflow-hidden'>
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <p className='text-sm font-semibold text-brand-navy truncate'>
                      {currentUser.username}
                    </p>
                    <p className='text-xs text-gray-500 truncate'>{currentUser.email}</p>
                  </div>
                  <Link
                    to='/profile'
                    className='block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 hover:text-brand-green transition'
                  >
                    Profile
                  </Link>
                  <Link
                    to='/my-listings'
                    className='block px-4 py-2.5 text-sm text-brand-navy hover:bg-gray-50 hover:text-brand-green transition'
                  >
                    Listings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className='w-full text-left px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition'
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </li>
          ) : (
            <Link to='/sign-in'>
              <li className='text-brand-navy font-medium hover:text-brand-green transition'>
                Sign in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  )
}