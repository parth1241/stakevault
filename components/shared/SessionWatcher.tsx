'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/" && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
      router.push("/login");
    }
    
    if (session?.user?.role === "staker" && pathname.startsWith("/admin")) {
      router.push("/staker/dashboard");
    }
    
    if (session?.user?.role === "admin" && pathname.startsWith("/staker")) {
      router.push("/admin/dashboard");
    }
  }, [session, status, pathname, router]);

  return <div className="min-h-screen">{children}</div>;
}
