'use client'

import { useEffect } from 'react'
import { useGameStore } from '../lib/store/gameStore'
import LockInterface from '../components/game/LockInterface'

export default function Page() {
  const { room, clues, isLoading, error, fetchRoomData } = useGameStore()

  useEffect(() => {
    fetchRoomData('TEST')
  }, [fetchRoomData])

  if (isLoading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>

  if (error) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Debugger Page</h1>
      <div className="mb-4">
        <p><strong>Room Code:</strong> {room?.code || 'N/A'}</p>
        <p><strong>Status:</strong> {room ? 'Loaded' : 'Not Loaded'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clues.map((clue) => (
          <div key={clue.id} className="bg-gray-800 p-4 rounded">
            <p><strong>ID:</strong> {clue.id}</p>
            <p><strong>Type:</strong> {clue.type}</p>
            {clue.type === 'INTERACTIVE_LOCK' ? (
              <LockInterface clue={clue} />
            ) : clue.status === 'UNLOCKED' ? (
              <>
                <p><strong>Title:</strong> {clue.title}</p>
                <img src={clue.metadata.src} alt={clue.title} className="w-full h-32 object-cover mt-2" />
              </>
            ) : (
              <p className="text-gray-500">Locked Content</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}