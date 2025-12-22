import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const publicPaths = ["/auth", "/"];

export function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {

        const loginUrl = new URL("/auth", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};