import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice.js' //created hooks
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({}) //What ever data from Sign up form that change will save
  //Handling error
  const {loading, error} = useSelector((state) => state.user); //from redux
  const [userSucess, setuserSucess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      dispatch(signInStart()); //hooks
      const res = await fetch('/api/auth/sign-in', { //sending data to this address into JSON data
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(signInFailure(data.message)); //hooks
        return;
      }
      dispatch(signInSuccess(data)); //hooks
      navigate('/')
    }catch (error) {
      dispatch(signInFailure(error.message)) //hooks

    }
  }
  return (
    <div className='p-3 max-w-lg mx-atuo'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      {error && <p className='text-red-500 m-5 text-center'>{error}</p>}
      <p className='text-green-500 m-5 text-center'>{userSucess ? "User created successfully!": ""}</p>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id="email" onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer'>
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to="/sign-up"><span className='text-blue-700'>Sign up</span></Link>
      </div>

    </div>
  )
}
