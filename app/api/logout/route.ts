import { NextResponse } from 'next/server';

export async function GET() {
    const res = NextResponse.redirect('/');
    res.cookies.set('__Secure-next-auth.session-token', '', {
        path: '/',
        maxAge: 0,
    });
    return res;
}