'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1a1a1a] text-white flex flex-col px-6 py-12 sm:px-10">

      <main className="flex-1 flex flex-col justify-center items-center text-center space-y-10 px-4">
        <div>
          <h2 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 animate-fadeIn">
            Stay on Top of Every Event
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto animate-fadeIn delay-75">
            Discover, follow, and participate in events that matter to you.
          </p>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto animate-fadeIn delay-75">
            Eventory keeps you connected.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn delay-100">
          <Link
            href="/threads"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
          >
            Explore Threads
          </Link>
        </div>
      </main>

      <footer className="text-sm text-gray-500 mt-16 text-center">
        © {new Date().getFullYear()} Eventory. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }

        .delay-75 {
          animation-delay: 0.75s;
        }

        .delay-100 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
