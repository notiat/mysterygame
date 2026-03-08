import Link from 'next/link';
import Image from 'next/image';
import { loadStories } from '@/lib/platform/storyLoader';
import StoryLauncherForm from '@/components/game/StoryLauncherForm';

export default async function HomePage() {
  const stories = await loadStories();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-amber-400 font-bold">OpenCase Platform</p>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent mb-4">
            Detective Case Files
          </h1>
          <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto">
            Solve murder mysteries with your team. Examine evidence, interrogate suspects, and crack the case.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <article 
              key={story.id} 
              className="group overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-900/80 backdrop-blur hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="relative overflow-hidden">
                <Image 
                  src={story.meta.thumbnail} 
                  alt={story.name} 
                  width={1200} 
                  height={630} 
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
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
                <div className="mt-6 flex gap-3">
                  <Link 
                    href={`/game/${story.id}`} 
                    className="flex-1 text-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-base font-bold text-white hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/50"
                  >
                    🔍 Play Solo
                  </Link>
                  <Link 
                    href="/debug" 
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-base font-bold text-slate-100 hover:text-white transition-colors border border-slate-700"
                  >
                    ⚙️
                  </Link>
                </div>
                <StoryLauncherForm storyId={story.id} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}