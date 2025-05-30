'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type Thread = {
  id: string;
  title: string;
  category: string;
  creatorId: string;
};

export default function ThreadsPage() {
  const [Threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [CategoryFilter, setCategoryFilter] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const userId = session?.user?.id;

  useEffect(() => {
    fetch(`${API_BASE}/threads`)
      .then((res) => res.json())
      .then(setThreads)
      .catch(() => setError('Unable to fetch threads.'))
      .finally(() => setIsLoading(false));
  }, []);

  const removeThread = async (id: string) => {
    if (!confirm('Confirm deletion of this thread?') || !session?.user?.email) return;

    const response = await fetch(`${API_BASE}/threads/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-email': session.user.email },
    });

    if (response.ok) {
      setThreads((prev) => prev.filter((thread) => thread.id !== id));
    } else {
      alert('Error deleting the Thread.');
    }
  };

  const filteredThreads = Threads.filter((thread) => {
    const CategoryMatch = CategoryFilter ? thread.category === CategoryFilter : true;
    const searchMatch = thread.title.toLowerCase().includes(searchText.toLowerCase());
    return CategoryMatch && searchMatch;
  });

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Threads</h1>

      <div className="mb-6 flex flex-col gap-4">
        <input
          type="search"
          placeholder="Search Threads..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm"
        />

        <select
          value={CategoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm w-64 bg-black text-white"
        >
          <option value="">All Categories</option>
          <option value="Games">Games</option>
          <option value="News">News</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading threads...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredThreads.length === 0 ? (
        <p className="text-gray-500">No threads yet. Be the first one!</p>
      ) : (
        <ul className="space-y-3">
          {filteredThreads.map((thread) => (
            <li key={thread.id} className="border p-4 rounded shadow-sm relative">
              {thread.creatorId === userId && (
                <button
                  onClick={() => removeThread(thread.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              )}
              <Link href={`/threads/${thread.id}`}>
                <h2 className="text-xl font-medium text-indigo-600 hover:underline">
                  {thread.title}
                </h2>
              </Link>
              <span className="text-sm text-gray-500">Category: {thread.category}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
