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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400 font-bold mb-3">🎮 Multiplayer Lobby</p>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent mb-4">
            {storyName}
          </h1>
        </div>

        {/* Room Code */}
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-amber-400 font-bold uppercase tracking-wider mb-2">Room Code</p>
          <p className="text-5xl font-black text-white tracking-[0.3em] font-mono">{roomCode}</p>
          <p className="text-sm text-slate-400 mt-3">Share this code with your detective team</p>
        </div>

        {/* Player Info */}
        <div className="bg-slate-900/80 border-2 border-slate-700 rounded-2xl p-6 backdrop-blur">
          <p className="text-sm text-slate-400 mb-1">Your Agent Name:</p>
          <p className="text-2xl font-bold text-white">
            {nickname} {isHost && <span className="text-amber-400">★ Host</span>}
          </p>
        </div>

        {/* Connected Players */}
        <div className="bg-slate-900/80 border-2 border-slate-700 rounded-2xl p-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400">👥 Detective Team</h2>
            <span className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-bold text-slate-300">
              {players.length}/4
            </span>
          </div>
          <div className="space-y-3">
            {players.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-lg">⏳ Waiting for detectives to join...</p>
                <p className="text-slate-600 text-sm mt-2">Share the room code above</p>
              </div>
            ) : (
              players.map((player, idx) => (
                <div
                  key={player.id}
                  className="flex items-center gap-4 bg-slate-950/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black border-2"
                    style={{ 
                      backgroundColor: `${player.color}20`, 
                      borderColor: player.color,
                      color: player.color
                    }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold" style={{ color: player.color }}>
                      {player.name}
                    </p>
                    <p className="text-xs text-slate-500">Agent #{idx + 1}</p>
                  </div>
                  <div className="text-emerald-400 text-xl">●</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Start Button or Waiting */}
        <div className="text-center">
          {isHost ? (
            <button 
              onClick={onStartGame}
              disabled={players.length === 0}
              className="min-h-[64px] rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-xl font-black text-white hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-2xl hover:shadow-emerald-500/50 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              ▶ Start Case Briefing
            </button>
          ) : (
            <div className="bg-slate-900/80 border-2 border-slate-700 rounded-2xl p-6 backdrop-blur">
              <p className="text-slate-400 text-lg">⏳ Waiting for host to start the investigation...</p>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
