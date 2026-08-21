import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATHS = ["/login", "/register"];

export const authConfig = {
    pages: { signIn: "/login" },
    providers: [],
    callbacks: {
        authorized({ auth, request }) {
            const isPublic = PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));
            const isLoggedIn = !!auth?.user;

            if (isLoggedIn && isPublic) {
                return Response.redirect(new URL("/", request.nextUrl.origin));
            }
            if (!isLoggedIn && !isPublic) {
                return false;
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
