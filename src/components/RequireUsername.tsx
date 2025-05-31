"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function RequireUsername() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUsername = async () => {
      if (!session?.user?.email) return;

      const res = await fetch(`${API_BASE}/user?email=${encodeURIComponent(session.user.email)}`);
      const user = await res.json();

      if (!user.username && pathname !== "/create-username") {
        router.replace("/create-username");
      }
    };

    if (status === "authenticated") {
      checkUsername();
    }
  }, [session, status, pathname, router]);

  return null; 
}
