// src/pages/AgentProfile.jsx
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function AgentProfile() {
  const params = useParams()

  const [agent, setAgent] = useState(null)
  const [agentListings, setAgentListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        setError(false)

        const res = await fetch(`/api/user/${params.agentId}`)
        const data = await res.json()

        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }

        setAgent(data)

        const listingsRes = await fetch(`/api/listing/get?userRef=${params.agentId}`)
        const listingsData = await listingsRes.json()
        setAgentListings(listingsData)

        setLoading(false)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }

    fetchAgent()
  }, [params.agentId])

  if (loading) {
    return <p className='text-center my-10 text-2xl text-brand-navy'>Loading...</p>
  }

  if (error || !agent) {
    return (
      <p className='text-center my-10 text-2xl text-red-700'>
        Agent not found
      </p>
    )
  }

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <div className='flex flex-col lg:flex-row gap-8 mt-4'>

        {/* LEFT: Agent's listings */}
        <div className='flex-1 order-2 lg:order-1'>
          <h2 className='text-2xl font-semibold text-brand-navy mb-5'>
            Listings by {agent.username}
          </h2>

          {agentListings.length === 0 && (
            <p className='text-gray-500 text-center py-10'>
              This agent hasn't posted any listings yet.
            </p>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {agentListings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        </div>

        {/* RIGHT: About the agent */}
        <div className='w-full lg:w-80 order-1 lg:order-2'>
          <div className='border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center gap-3 sticky top-24'>
            <img
              src={agent.avatar}
              alt={agent.username}
              className='w-28 h-28 rounded-full object-cover border-4 border-brand-wood'
            />
            <h1 className='text-xl font-semibold text-brand-navy'>{agent.username}</h1>
            <p className='text-sm text-brand-green font-medium'>{agent.title}</p>
            <p className='text-sm text-gray-500'>{agent.email}</p>

            {agent.bio && (
              <p className='text-sm text-gray-600 mt-2 leading-relaxed'>
                {agent.bio}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}