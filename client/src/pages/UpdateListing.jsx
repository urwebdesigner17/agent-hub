// src/pages/UpdateListing.jsx
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const params = useParams()
  const listingId = params.listingId

  const [files, setFiles] = useState([])
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(`/api/listing/get/${listingId}`)
      const data = await res.json()

      if (data.success === false) {
        console.log(data.message)
        return
      }

      setFormData(data)
    }

    fetchListing()
  }, [listingId])

  const compressImage = (file, maxSizeMB = 2, maxDimension = 1600) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)

        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.9
        const tryCompress = () => {
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          const sizeMB = (dataUrl.length * 0.75) / (1024 * 1024)

          if (sizeMB <= maxSizeMB || quality <= 0.3) {
            resolve(dataUrl)
          } else {
            quality -= 0.1
            tryCompress()
          }
        }
        tryCompress()
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`Could not read ${file.name}`))
      }

      img.src = objectUrl
    })
  }

  const handleImageSubmit = () => {
    if (files.length === 0) return

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload up to 6 images per listing')
      return
    }

    setUploading(true)
    setImageUploadError(false)

    const promises = Array.from(files).map((file) => compressImage(file, 2, 1600))

    Promise.all(promises)
      .then((base64Images) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(base64Images),
        })
        setUploading(false)
      })
      .catch((error) => {
        setImageUploadError(error.message || 'Image upload failed')
        setUploading(false)
      })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  }

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target

    if (id === 'sale' || id === 'rent') {
      setFormData({ ...formData, type: id })
      return
    }

    if (type === 'checkbox') {
      setFormData({ ...formData, [id]: checked })
      return
    }

    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.imageUrls.length < 1) {
        return setSubmitError('You must upload at least 1 image')
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setSubmitError('Discount price must be lower than regular price')
      }

      setLoading(true)
      setSubmitError(false)

      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      })

      const data = await res.json()
      setLoading(false)

      if (data.success === false) {
        setSubmitError(data.message)
        return
      }

      navigate(`/profile`)
    } catch (error) {
      setSubmitError(error.message)
      setLoading(false)
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center text-brand-navy my-7'>
        Update Listing
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
            className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
          />
          <textarea
            placeholder='Description'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
            className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition resize-none h-28'
          />
          <input
            type='text'
            placeholder='Address'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
            className='border border-gray-300 focus:border-brand-navy focus:outline-none p-3 rounded-lg transition'
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='sale'
                onChange={handleChange}
                checked={formData.type === 'sale'}
                className='w-5 h-5 accent-brand-green'
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='rent'
                onChange={handleChange}
                checked={formData.type === 'rent'}
                className='w-5 h-5 accent-brand-green'
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='parking'
                onChange={handleChange}
                checked={formData.parking}
                className='w-5 h-5 accent-brand-green'
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='furnished'
                onChange={handleChange}
                checked={formData.furnished}
                className='w-5 h-5 accent-brand-green'
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='checkbox'
                id='offer'
                onChange={handleChange}
                checked={formData.offer}
                className='w-5 h-5 accent-brand-green'
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className='p-3 border border-gray-300 rounded-lg w-16 focus:border-brand-navy focus:outline-none'
              />
              <span>Beds</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bathrooms}
                className='p-3 border border-gray-300 rounded-lg w-16 focus:border-brand-navy focus:outline-none'
              />
              <span>Baths</span>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='0'
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className='p-3 border border-gray-300 rounded-lg w-24 focus:border-brand-navy focus:outline-none'
              />
              <div className='flex flex-col items-center'>
                <span>Regular price</span>
                {formData.type === 'rent' && <span className='text-xs text-gray-500'>($ / month)</span>}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className='p-3 border border-gray-300 rounded-lg w-24 focus:border-brand-navy focus:outline-none'
                />
                <div className='flex flex-col items-center'>
                  <span>Discounted price</span>
                  {formData.type === 'rent' && <span className='text-xs text-gray-500'>($ / month)</span>}
                </div>
              </div>
            )}
          </div>

          <button
            disabled={loading || uploading}
            className='bg-brand-green text-white rounded-lg p-3 uppercase hover:bg-brand-greenDark transition disabled:opacity-60 mt-2'
          >
            {loading ? 'Updating...' : 'Update Listing'}
          </button>

          {submitError && <p className='text-red-700 text-sm'>{submitError}</p>}
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold text-brand-navy'>
            Images:
            <span className='font-normal text-gray-500 ml-2'>
              The first image will be the cover (max 6). Large photos are compressed automatically.
            </span>
          </p>

          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              type='file'
              id='images'
              accept='image/*'
              multiple
              className='p-3 border border-gray-300 rounded-lg w-full'
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='px-4 border border-brand-navy text-brand-navy rounded-lg uppercase hover:bg-brand-navy hover:text-white transition disabled:opacity-60'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {imageUploadError && (
            <p className='text-red-700 text-sm'>{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className='flex justify-between p-3 border items-center rounded-lg'
              >
                <img
                  src={url}
                  alt='listing'
                  className='w-20 h-20 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='text-red-700 hover:underline uppercase text-sm'
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </form>
    </main>
  )
}