'use client';

import { PresenceUser } from '@/types/platform';

interface RoomLobbyProps {
  roomCode: string;
  storyName: string;
  nickname: string;
  isHost: boolean;
  players: PresenceUser[];
  onStartGame: () => void;
}

export default function RoomLobby({ roomCode, storyName, nickname, isHost, players, onStartGame }: RoomLobbyProps) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold">Room Lobby: {roomCode}</h1>
        <p className="text-slate-300">
          Story: <span className="font-semibold">{storyName}</span>
        </p>
        <p className="text-slate-300">
          You are <span className="font-semibold">{nickname}</span> ({isHost ? 'Host' : 'Player'})
        </p>
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
          <p className="mb-2 text-sm uppercase tracking-wider text-slate-400">Connected Players</p>
          <div className="space-y-1 text-sm">
            {players.length === 0 ? <p className="text-slate-500">Waiting for players...</p> : null}
            {players.map((player) => (
              <p key={player.id} style={{ color: player.color }}>
                {player.name}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
          Share this room code with friends: <span className="font-semibold">{roomCode}</span>
        </div>
        {isHost ? (
          <button onClick={onStartGame} className="rounded bg-blue-600 px-4 py-2 font-semibold text-white">
            Start Narrated Mystery
          </button>
        ) : (
          <p className="text-slate-400">Waiting for host to start the case briefing...</p>
        )}
      </div>
    </main>
  );
}
