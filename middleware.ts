import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Public paths handled by NextAuth (signIn, etc) are exempt by default
    // Custom role checks
    if (path.startsWith("/staker") && token?.role !== "staker") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/staker/dashboard", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/staker/:path*",
    "/admin/:path*",
  ],
};
