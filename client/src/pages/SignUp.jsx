import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import agentPhoto from '../assets/agent-photo.jpg'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userSucess, setuserSucess] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async (e)=> {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        setuserSucess(false);
        return;
      }
      setLoading(false)
      setError(null)
      setuserSucess(true)
      navigate('/sign-in')
    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return (
    <div className='min-h-[calc(100vh-80px)] flex flex-col-reverse sm:flex-row'>

      {/* Left: Form */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <div className='w-full max-w-md'>
          <h1 className='text-3xl font-bold text-brand-navy mb-2'>Create your account</h1>
          <p className='text-gray-500 mb-7'>Join AgentHub and start your home search today.</p>

          {error && <p className='text-red-600 mb-4 text-sm bg-red-50 border border-red-200 rounded-lg p-3'>{error}</p>}
          {userSucess && <p className='text-brand-green mb-4 text-sm bg-brand-green/10 border border-brand-green/30 rounded-lg p-3'>User created successfully!</p>}

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Username'
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
              id="username"
              onChange={handleChange}
            />
            <input
              type='email'
              placeholder='Email'
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
              id="email"
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
              id="password"
              onChange={handleChange}
            />
            <button
              disabled={loading}
              className='bg-brand-green text-white p-3 rounded-lg uppercase font-medium hover:bg-brand-greenDark transition disabled:opacity-60 cursor-pointer'
            >
              {loading ? "Loading..." : "Sign up"}
            </button>

            <div className='flex items-center gap-3 my-1'>
              <div className='h-px bg-gray-200 flex-1'></div>
              <span className='text-xs text-gray-400 uppercase'>or</span>
              <div className='h-px bg-gray-200 flex-1'></div>
            </div>

            <OAuth/>
          </form>

          <div className='flex gap-2 mt-6 text-sm'>
            <p className='text-gray-500'>Have an account?</p>
            <Link to="/sign-in"><span className='text-brand-navy font-medium hover:text-brand-green transition'>Sign in</span></Link>
          </div>
        </div>
      </div>

      {/* Right: Agent showcase */}
      <div className='flex-1 relative bg-brand-navy flex items-center justify-center p-10 overflow-hidden min-h-[280px] sm:min-h-0'>
        <div className='absolute w-72 h-72 bg-brand-green rounded-full -top-10 -right-10 opacity-20'></div>
        <div className='absolute w-40 h-40 bg-brand-wood rounded-full bottom-10 left-0 opacity-30'></div>
        <div className='absolute w-24 h-24 bg-brand-green rounded-full bottom-0 right-16 opacity-20'></div>

        <div className='relative z-10 max-w-sm text-center'>
          <img
            src={agentPhoto}
            alt='AgentHub real estate agent'
            className='w-56 h-56 object-cover rounded-full mx-auto shadow-xl border-4 border-white/20'
          />
          <h2 className='text-white text-2xl font-bold mt-6'>
            Real agents. <span className='text-brand-green'>Real results.</span>
          </h2>
          <p className='text-gray-300 mt-3 text-sm'>
            Create your free account and get matched with trusted agents
            ready to help you buy, sell, or rent with confidence.
          </p>
        </div>
      </div>
    </div>
  )
}