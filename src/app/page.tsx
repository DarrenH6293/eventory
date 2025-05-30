"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col px-6 py-12 sm:px-10">

      <main className="flex-1 text-center space-y-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Welcome to Eventory!
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Discover and stay updated on events you care about.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/threads"
            className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-300 transition"
          >
            View Threads
          </Link>
          <Link
            href="/create-thread"
            className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition"
          >
            Create a Thread
          </Link>
        </div>
      </main>

      <footer className="text-sm text-gray-500 mt-16 text-center">
        © {new Date().getFullYear()} Eventory. All rights reserved.
      </footer>
    </div>
  );
}
