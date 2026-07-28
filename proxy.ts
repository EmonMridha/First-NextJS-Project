import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

const AUTH_ROUTES = ['/login', '/register']
const PUBLIC_ROUTES = ['/', '/news', '/login', '/register']

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname // getting the url the user want to visit

    // const cookieStore = await cookies() // license to access cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    const decodedToken = accessToken ? jwt.decode(accessToken) as JwtPayload : null

    let userRole = null;

    if (decodedToken) {
        userRole = decodedToken.role
    }

    if (accessToken && AUTH_ROUTES.includes(pathname)) {
        if (userRole === "USER") {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
        } else if (userRole === "AUTHOR") {
            return NextResponse.redirect(new URL('/author-dashboard', request.url))
        } else {
            return NextResponse.redirect(new URL('/'))
        }
    }

    const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))

    if (!accessToken && !isPublic && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin-dashboard/:path*'
    ],
}