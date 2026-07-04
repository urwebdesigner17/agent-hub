import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [formData, setFormData] = useState({}) //What ever data from Sign up form that change will save
  //Handling error
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userSucess, setuserSucess] = useState(false);
  const navigate = useNavigate()
  //If user wish to edit or change some data
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    })
  }

  const handleSubmit = async (e)=> {
    e.preventDefault(); //prevent the browser to refresh once click submit
    try {
      setLoading(true);
      const res = await fetch('/api/auth/sign-up', { //sending data to this address into JSON data
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
    <div className='p-3 max-w-lg mx-atuo'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      {error && <p className='text-red-500 m-5 text-center'>{error}</p>}
      <p className='text-green-500 m-5 text-center'>{userSucess ? "User created successfully!": ""}</p>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id="username" onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id="email" onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer'>
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in"><span className='text-blue-700'>Sign in</span></Link>
      </div>

    </div>
  )
}
