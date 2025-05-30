'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateThreadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const { data: session, status } = useSession();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status]);

  if (status === 'loading') return <p>Loading...</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, creatorId: session?.user?.id }),
    });

    if (res.ok) {
      setMessage('Thread created!');
      setTitle('');
      setCategory('');
      router.push('/threads');
    } else {
      const err = await res.json();
      setMessage(`${err.error || 'Failed to create thread'}`);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Create a New Thread</h1>

        {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <select
              className="w-full border px-3 py-2 rounded bg-white text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Games">Games</option>
              <option value="News">News</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Thread
          </button>
        </form>
      </div>
    </div>
  );
}
