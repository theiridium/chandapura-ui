import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(request) {
        const headers = new Headers(request.headers);
        headers.set("x-current-path", request.nextUrl.pathname);
    },
)

export const config = {
    matcher: ['/dashboard/:path*'],
}