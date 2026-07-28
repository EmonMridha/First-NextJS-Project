import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { jwtUtils } from './lib/jwt'
import { cookies } from 'next/headers'
import { getNewAccessToken } from './service/refreshToken'

const AUTH_ROUTES = ['/login', '/register']
const PUBLIC_ROUTES = ['/', '/news', '/login', '/register']

export const proxy = async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname // getting the url from the request the user wants to visit
    const cookieStore = await cookies() // license to access cookies
    let accessToken = request.cookies.get('accessToken')?.value; // Getting the accessToken from the cookies in the request 
    const refreshToken = request.cookies.get("refreshToken")?.value; // GEtting the refresh from the cookies in the request

    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null // Finding the owner info of the accessToken owner

    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string) : null // Finding the owner info of the refreshToken owner

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        const result = await getNewAccessToken(); // Creating new accessToken

        if (result.success.true) {
            const newAccessToken = result.data.accessToken;

            cookieStore.set('accessToken', newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax"
            });

            accessToken = newAccessToken
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string)
        }
    }

    let userRole = null;

    // Delete the accessToken if expired
    if (!decodedAccessToken?.success) {
        cookieStore.delete('accessToken');
    }

    if (decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role
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

    // role based access control
    if (pathname.startsWith("/dashboard") && userRole !== "USER") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    } else if (pathname.startsWith('/admin-dashboard') && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    } else if (pathname.startsWith('/author-dashboard') && userRole !== "AUTHOR") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    }

    return NextResponse.next()
}


// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin-dashboard/:path*',
        '/author-dashboard/:path*'
    ],
}