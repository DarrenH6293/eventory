"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CreateUsernamePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
        if (status === 'loading') return;
  
        if (!session?.user?.email) {
          router.push('/');
          return;
        }
  
        try {
          const res = await fetch(`${API_BASE}/user?email=${encodeURIComponent(session.user.email)}`);
          if (res.ok) {
            const user = await res.json();
            if (user.username) {
              router.push('/');
            }
          } else {
            console.error('Failed to fetch user data');
            router.push('/');
          }
        } catch (err) {
          console.error('Error checking user:', err);
          router.push('/');
        }
      };
  
      checkUsername();
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          username,
        }),
      });

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to set username");
      }
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-white">
      <h1 className="text-2xl font-bold mb-4">Enter a Username</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded bg-black text-white"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Username"}
        </button>
      </form>
    </div>
  );
}
