import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/admin": ["admin"],
  "/profile/admin": ["admin"],
  "/dashboard/user": ["user", "admin", "owner"],
  "/profile/user": ["user", "admin", "owner"],
  "/deals": ["user", "admin", "owner"],
  "/cart": ["user", "admin", "owner"],
}

// Routes that require authentication but no specific role
const authRequiredRoutes = ["/dashboard", "/profile", "/deals", "/cart"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token from cookies or headers
  const token =
    request.cookies.get("accessToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // Get user data from cookies (set by client-side auth)
  const userCookie = request.cookies.get("user")?.value
  let user = null

  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      console.error("[middleware] Failed to parse user cookie:", error)
    }
  }

  // Check if route requires authentication
  const requiresAuth = authRequiredRoutes.some((route) => pathname.startsWith(route))
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) => pathname.startsWith(route))

  // If route requires auth but no token, redirect to home with auth modal
  if ((requiresAuth || isProtectedRoute) && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("auth", "required")
    return NextResponse.redirect(url)
  }

  // Check role-based access for protected routes
  if (isProtectedRoute && user) {
    const matchedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route))
    if (matchedRoute) {
      const requiredRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes]

      if (!requiredRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        const url = request.nextUrl.clone()
        if (user.role === "admin") {
          url.pathname = "/dashboard/admin"
        } else {
          url.pathname = "/dashboard/user"
        }
        return NextResponse.redirect(url)
      }
    }
  }

  // Add user info to headers for server components
  const response = NextResponse.next()
  if (user) {
    response.headers.set("x-user-id", user._id)
    response.headers.set("x-user-role", user.role)
    response.headers.set("x-user-authenticated", "true")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
