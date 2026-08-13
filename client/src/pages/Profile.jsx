import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice'

export default function Profile() {
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const { currentUser, loading, error } = useSelector((state) => state.user)

  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Hello agent <span className='text-brand-navy'>{currentUser.username}</span>
      </h1>

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

      <div className='flex justify-between mt-5'>
        <span onClick={() => setShowDeleteModal(true)} className='text-red-700 cursor-pointer hover:underline'>
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer hover:underline'>Sign out</span>
      </div>

      {error && <p className='text-red-700 mt-5 text-center'>{error}</p>}
      {updateSuccess && (
        <p className='text-brand-green mt-5 text-center'>
          Profile updated successfully!
        </p>
      )}

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
    </div>
  )
}