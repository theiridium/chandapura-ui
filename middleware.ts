import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(request) {
        const headers = new Headers(request.headers);
        headers.set("x-current-path", request.nextUrl.pathname);

        const token = request.nextauth.token?.strapiToken;
        if (token) {
            try {
                const strapiRes: any = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/areas`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = strapiRes.json();
                if (data?.error?.status === 401) {
                    const res = NextResponse.redirect(new URL('/login', request.url));
                    res.cookies.set('__Secure-next-auth.session-token', '', {
                        maxAge: 0,
                        path: '/',
                    });
                    return res;
                }
            } catch (e) {
                console.error("Strapi token validation failed", e);
                // fallback redirect if needed
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    },
)

export const config = {
    matcher: ['/dashboard/:path*'],
}