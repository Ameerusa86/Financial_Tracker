"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

/**
 * Session Monitor component
 * Monitors for explicit session errors/expiry rather than polling
 */
export function SessionMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, error } = authClient.useSession();

  useEffect(() => {
    // Public routes that don't need auth
    const publicRoutes = ["/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Only redirect if there's an explicit error and we're on a protected route
    if (error && !isPublicRoute) {
      console.log("Session error detected, redirecting to login:", error);
      router.push("/login");
    }

    // Also check if session is explicitly null (logged out) on protected routes
    // But only after initial load to avoid race conditions
    if (session === null && !isPublicRoute && typeof window !== "undefined") {
      // Small delay to avoid race condition during initial load
      const timeout = setTimeout(() => {
        if (!session && !isPublicRoute) {
          console.log("No session found on protected route, redirecting");
          router.push("/login");
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [session, error, router, pathname]);

  return null;
}
