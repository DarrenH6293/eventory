'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Post = {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  authorId: string;
};

type Thread = {
  id: string;
  creatorId: string;
};

export default function ThreadDetail() {
  const { data: session } = useSession();
  const { id: threadId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posting, setPosting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [thread, setThread] = useState<Thread | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const currentUserId = session?.user?.id;
  const userEmail = session?.user?.email;
  const isThreadCreator = thread?.creatorId === currentUserId;

  useEffect(() => {
    fetch(`${API_BASE}/threads/${threadId}/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoadingPosts(false));
  }, [threadId]);

  useEffect(() => {
    fetch(`${API_BASE}/threads/${threadId}`)
      .then((res) => res.json())
      .then(setThread)
      .catch(console.error);
  }, [threadId]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert('You must be signed in to post.');
      return;
    }

    setPosting(true);
    const res = await fetch(`${API_BASE}/threads/${threadId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId,
        authorId: currentUserId,
        content,
        tags: tags.split(',').map((tag) => tag.trim()),
      }),
    });
    const data = await res.json();
    setPosts((prev) => [...prev, data]);
    setContent('');
    setTags('');
    setPosting(false);
  };

  const handleDelete = async (postId: string) => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed || !userEmail) return;

    const res = await fetch(`${API_BASE}/threads/${threadId}/${postId}`, {
      method: 'DELETE',
      headers: {
        'x-user-email': userEmail,
      },
    });

    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } else {
      alert('Failed to delete post.');
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="p-6 text-white max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Thread Posts</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search posts by content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded text-white bg-[#1a1a1a] border border-gray-600"
          />
        </div>

        {thread === null ? (
          <div className="animate-pulse text-gray-400 mb-6"></div>
        ) : isThreadCreator ? (
          <form onSubmit={handlePostSubmit} className="space-y-4 mb-6">
            <textarea
              placeholder="Write a post..."
              className="w-full p-2 rounded text-white bg-[#1a1a1a] border border-gray-600"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              className="w-full p-2 rounded text-white bg-[#1a1a1a] border border-gray-600"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
              disabled={posting}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>
        ) : (
          <p className="mb-6 text-yellow-500 font-medium"></p>
        )}

        <ul className="space-y-4">
          {loadingPosts
            ? Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="border p-4 rounded bg-[#1a1a1a] animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </li>
              ))
            : filteredPosts.map((post) => (
                <li key={post.id} className="border p-4 rounded bg-[#1a1a1a] relative">
                  {session && post.authorId === currentUserId && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                  <p>{post.content}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    Tags: {(post.tags ?? []).join(', ')}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
