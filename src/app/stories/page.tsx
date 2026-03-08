import Link from 'next/link';
import { loadStories } from '@/lib/platform/storyLoader';

export default async function StoriesPage() {
  const stories = await loadStories();
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <h1 className="text-3xl font-bold">Available Stories</h1>
      <div className="mt-4 space-y-3">
        {stories.map((story) => (
          <article key={story.id} className="rounded border border-slate-700 bg-slate-900 p-4">
            <h2 className="text-xl font-semibold">{story.name}</h2>
            <p className="text-sm text-slate-300">{story.meta.description}</p>
            <Link href={`/game/${story.id}`} className="mt-3 inline-block rounded bg-blue-600 px-3 py-1 text-sm font-semibold">
              Play
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
