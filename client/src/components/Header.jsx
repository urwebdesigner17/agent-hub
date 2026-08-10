import React from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='bg-white shadow-md'>
        <div className='flex justify-between item-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-brand-navy'>Agent</span>
                    <span className='text-brand-green'>Hub</span>
                </h1>
            </Link>
            <form className='bg-gray-100 p-3 rounded-lg flex items-center'>
                <FaSearch className='text-brand-wood' />
                <input className='bg-transparent focus:outline-none w-24 sm:w-64' type='text' placeholder='Search...' />
            </form>
            <ul className='flex gap-4'>
                <Link to='/'><li className='hidden sm:inline text-brand-navy hover:text-brand-green transition'>Home</li></Link>
                <Link to='/about'><li className='hidden sm:inline text-brand-navy hover:text-brand-green transition'>About</li></Link>
                <Link to='/profile'>
                    {currentUser ? (
                        <img
                            className='rounded-full h-7 w-7 object-cover border-2 border-brand-wood'
                            src={currentUser.avatar}
                            alt='profile'
                        />
                    ) : (
                        <li className='text-brand-navy hover:text-brand-green transition'>Sign in</li>
                    )}
                </Link>
            </ul>
        </div>
    </header>
  )
}