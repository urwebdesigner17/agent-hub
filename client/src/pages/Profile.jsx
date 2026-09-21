import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice'

export default function Profile() {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser, loading, error } = useSelector((state) => state.user)

  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)

  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    } finally {
      setShowDeleteModal(false)
    }
  }

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
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleGoToDashboard = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true)
      return
    }
    navigate('/dashboard')
  }

  // Live preview values — fall back to currentUser until edited
  const previewAvatar = formData.avatar || currentUser.avatar
  const previewUsername = formData.username || currentUser.username
  const previewTitle = formData.title !== undefined ? formData.title : currentUser.title
  const previewEmail = formData.email || currentUser.email
  const previewBio = formData.bio !== undefined ? formData.bio : currentUser.bio
  const hasUnsavedChanges = Object.keys(formData).length > 0 && !updateSuccess

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <h1 className='text-3xl font-semibold text-center my-7 text-brand-navy'>
        Edit Your Profile
      </h1>

      <div className='flex flex-col lg:flex-row gap-8'>

        {/* LEFT: Form */}
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input
              onChange={(e) => setFile(e.target.files[0])}
              type='file'
              ref={fileRef}
              hidden
              accept='image/*'
            />
            <img
              onClick={() => fileRef.current.click()}
              src={previewAvatar}
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
              onChange={handleChange}
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
            />
            <input
              type='email'
              placeholder='email'
              defaultValue={currentUser.email}
              id='email'
              onChange={handleChange}
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
            />
            <input
              type='text'
              placeholder='title (e.g. Senior Agent, Broker)'
              defaultValue={currentUser.title}
              id='title'
              onChange={handleChange}
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
            />
            <textarea
              placeholder='Bio (tell visitors a bit about yourself, your company, or experience)'
              defaultValue={currentUser.bio}
              id='bio'
              rows='4'
              onChange={handleChange}
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition resize-none'
            />
            <input
              type='password'
              placeholder='password'
              id='password'
              onChange={handleChange}
              className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
            />

            <button
              disabled={loading}
              className='bg-brand-green text-white rounded-lg p-3 uppercase hover:bg-brand-greenDark transition disabled:opacity-60'
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>

          <div className='flex justify-between mt-6 gap-3'>
            <button
              type='button'
              onClick={() => setShowDeleteModal(true)}
              className='flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition rounded-lg py-2.5 text-sm font-medium'
            >
              Delete account
            </button>
            <button
              type='button'
              onClick={handleSignOut}
              className='flex-1 flex items-center justify-center gap-2 border border-gray-300 text-brand-navy hover:bg-gray-100 transition rounded-lg py-2.5 text-sm font-medium'
            >
              Sign out
            </button>
          </div>

          {error && <p className='text-red-700 mt-5 text-center'>{error}</p>}
          {updateSuccess && (
            <p className='text-brand-green mt-5 text-center'>
              Profile updated successfully!
            </p>
          )}
        </div>

        {/* RIGHT: Live preview — how buyers will see this agent */}
        <div className='w-full lg:w-80'>
          <p className='text-xs uppercase text-gray-400 font-medium mb-2 text-center lg:text-left'>
            How buyers will see you
          </p>
          <div className='border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center gap-3 sticky top-24'>
            <img
              src={previewAvatar}
              alt={previewUsername}
              className='w-28 h-28 rounded-full object-cover border-4 border-brand-wood'
            />
            <h2 className='text-xl font-semibold text-brand-navy'>{previewUsername}</h2>
            <p className='text-sm text-brand-green font-medium'>{previewTitle}</p>
            <p className='text-sm text-gray-500'>{previewEmail}</p>

            {previewBio && (
              <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
                {previewBio}
              </p>
            )}

            <button
              type='button'
              onClick={handleGoToDashboard}
              className='w-full mt-4 border border-brand-navy text-brand-navy rounded-lg py-2.5 text-sm font-medium uppercase hover:bg-brand-navy hover:text-white transition'
            >
              Show my listings
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3'>
          <div className='bg-white rounded-xl shadow-lg max-w-sm w-full p-6'>
            <h2 className='text-xl font-semibold text-brand-navy mb-3'>
              Delete your account?
            </h2>
            <p className='text-gray-600 mb-6'>
              This action cannot be undone. Your profile and all associated
              data will be permanently removed.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowDeleteModal(false)}
                className='px-4 py-2 rounded-lg border border-gray-300 text-brand-navy hover:bg-gray-100 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className='px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition disabled:opacity-60'
              >
                {loading ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3'>
          <div className='bg-white rounded-xl shadow-lg max-w-sm w-full p-6'>
            <h2 className='text-xl font-semibold text-brand-navy mb-3'>
              You have unsaved changes
            </h2>
            <p className='text-gray-600 mb-6'>
              Leaving now will discard your edits. Do you want to leave without saving?
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowUnsavedModal(false)}
                className='px-4 py-2 rounded-lg border border-gray-300 text-brand-navy hover:bg-gray-100 transition'
              >
                Keep editing
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className='px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition'
              >
                Leave without saving
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}