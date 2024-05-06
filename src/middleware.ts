// import prisma from '@infra/config/databaseEdge';

import { TOKEN_KEY } from '@constants/CONFIGS';
import { validateToken } from '@utils/token';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        // all api routes except those that starts with /api/auth
        '/((?!auth|extension|_next/static|_next/image|favicon.ico).*) ',
    ]
}
export async function middleware(request: NextRequest) {
    let token = request.cookies.get(TOKEN_KEY)?.value || request.headers.get('Authorization');
    if (!token) return Response.json({
        err: 'Not authorized'
    })
    const { decoded: user } = validateToken(token)
    if (!user) return Response.json({
        err: 'Not authorized'
    })
    const requestHeaders = new Headers(request.headers)

    requestHeaders.set('Authorization', token);
    requestHeaders.set('id', user.id);
    requestHeaders.set('email', user.email);
    requestHeaders.set('name', user.name);
    requestHeaders.set('role', user.role);
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
    return response
}