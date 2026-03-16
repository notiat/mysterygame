import Link from 'next/link';
import Image from 'next/image';
import { loadStories } from '@/lib/platform/storyLoader';

export default async function HomePage() {
  const stories = await loadStories();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent mb-6 leading-tight">
            Solve Murders.<br/>Find Clues.<br/>Interrogate Suspects.
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-medium">
            FBI detective mystery games for teams
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {stories.map((story) => (
            <article 
              key={story.id} 
              className="group overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900/90 backdrop-blur hover:border-amber-500/70 transition-all duration-300 shadow-2xl hover:shadow-amber-500/30"
            >
              <div className="relative overflow-hidden">
                <Image 
                  src={story.meta.thumbnail} 
                  alt={story.name} 
                  width={1200} 
                  height={630} 
                  className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white mb-3">{story.name}</h2>
                <p className="mt-2 text-base text-slate-300 leading-relaxed">{story.meta.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-400">
                    <span className="text-amber-400 font-semibold">📍 Setting:</span> {story.meta.setting}
                  </p>
                  <p className="text-sm text-slate-400">
                    <span className="text-amber-400 font-semibold">👥 Players:</span> {story.meta.playerCount}
                  </p>
                </div>
                <div className="mt-6">
                  <Link 
                    href={`/game/${story.id}`} 
                    className="block w-full text-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl hover:shadow-amber-500/50 hover:scale-[1.02]"
                  >
                    Start Investigation →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}