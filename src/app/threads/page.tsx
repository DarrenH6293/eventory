"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Thread = {
  id: string;
  title: string;
  category: string;
  creatorId: string;
};

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const currentUserId = session?.user?.id;

  useEffect(() => {
    fetch(`${API_BASE}/threads`)
      .then((res) => res.json())
      .then(setThreads)
      .catch((err) => {
        console.error(err);
        setError("Failed to load threads");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this thread?");
    if (!confirmed || !session?.user?.email) return;

    const res = await fetch(
      `${API_BASE}/threads/${id}`,
      {
        method: "DELETE",
        headers: {
          "x-user-email": session.user.email,
        },
      }
    );

    if (res.ok) {
      setThreads((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert("Failed to delete thread.");
    }
  };

  const filteredThreads = threads.filter((t) => {
    const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Threads</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by thread title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md bg-white text-black px-3 py-2 rounded border"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Filter by Category:</label>
        <select
          className="w-full max-w-xs bg-white text-black px-3 py-2 rounded border"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Games">Games</option>
          <option value="News">News</option>
        </select>
      </div>

      {loading && (
        <ul className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="border p-4 rounded bg-[#1a1a1a] shadow">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-600">{error}</p>}
      {!loading && threads.length === 0 && !error && <p>No threads. Be the first one!</p>}

      {!loading && (
        <ul className="space-y-2">
          {filteredThreads.map((thread) => (
            <li key={thread.id} className="border p-4 rounded shadow relative">
              {thread.creatorId === currentUserId && (
                <button
                  onClick={() => handleDelete(thread.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              )}
              <Link href={`/threads/${thread.id}`}>
                <h2 className="text-lg font-semibold text-blue-400 hover:underline">
                  {thread.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-400">Category: {thread.category}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
