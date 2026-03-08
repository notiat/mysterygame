export interface Room {
  id: string
  code: string
  name?: string
  // Add other fields as needed
}

export interface Clue {
  id: string
  room_id: string
  title: string
  type: string
  status: 'LOCKED' | 'UNLOCKED'
  metadata: {
    src?: string
    rewardImage?: string
    lockSolution?: string
    [key: string]: unknown
  }
}