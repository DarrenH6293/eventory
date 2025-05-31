'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';


const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Navbar() {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`${API_BASE}/user?email=${encodeURIComponent(session.user.email)}`);
          if (res.ok) {
            const user = await res.json();
            setUsername(user.username);
          }
        } catch (err) {
          console.error('Failed to fetch user info:', err);
        }
      }
    };

    fetchUsername();
  }, [session]);

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white p-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/eventory-logo.svg"
            alt="Eventory Logo"
            width={160}
            height={160}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>
        <Link href="/threads" className="hover:underline">
          Threads
        </Link>
        {session && (
          <Link href="/create-thread" className="hover:underline">
            Create Thread
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span className="text-sm text-gray-300">{username}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
