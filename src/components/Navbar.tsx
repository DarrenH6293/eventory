'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

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
            <span className="text-sm text-gray-300">{session.user?.email}</span>
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
