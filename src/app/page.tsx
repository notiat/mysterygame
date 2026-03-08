import Link from 'next/link';
import Image from 'next/image';
import { loadStories } from '@/lib/platform/storyLoader';
import StoryLauncherForm from '@/components/game/StoryLauncherForm';

export default async function HomePage() {
  const stories = await loadStories();

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">OpenCase Platform</p>
        <h1 className="text-4xl font-bold">Mystery Story Launcher</h1>
        <p className="mt-2 text-slate-300">
          Story-agnostic architecture. Terminal Velocity is installed as Story Pack #1.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {stories.map((story) => (
            <article key={story.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
              <Image src={story.meta.thumbnail} alt={story.name} width={1200} height={630} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-2xl font-semibold">{story.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{story.meta.description}</p>
                <p className="mt-2 text-xs text-slate-400">Setting: {story.meta.setting}</p>
                <p className="mt-1 text-xs text-slate-400">Players: {story.meta.playerCount}</p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/game/${story.id}`} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Solo Preview
                  </Link>
                  <Link href="/debug" className="rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100">
                    Debug Tools
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