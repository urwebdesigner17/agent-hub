import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector((state) => state.user)

  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
    // Basic size guard — MongoDB documents have a 16MB limit,
    // and base64 encoding adds ~33% overhead, so keep images small
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true)
      return
    }

    setFileUploadError(false)
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        setFilePerc(progress)
      }
    }

    reader.onload = () => {
      setFormData({ ...formData, avatar: reader.result })
    }

    reader.onerror = () => {
      setFileUploadError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Hello agent <span className='text-brand-navy'>{currentUser.username}</span>
      </h1>

      <form className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-4 border-brand-wood'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Image must be under 2MB</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-brand-navy'>{`Reading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-brand-green'>Image ready</span>
          ) : (
            <span className='text-brand-navy'>Click image to change your avatar</span>
          )}
        </p>

        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
        />
        <input
          type='email'
          placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
        />

        <button className='bg-brand-green text-white rounded-lg p-3 uppercase hover:bg-brand-greenDark transition disabled:opacity-80'>
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer hover:underline'>Delete account</span>
        <span className='text-red-700 cursor-pointer hover:underline'>Sign out</span>
      </div>
    </div>
  )
}