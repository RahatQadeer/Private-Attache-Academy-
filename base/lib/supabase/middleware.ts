import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRODUCTION_HOST = "private-attache-dun.vercel.app";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/invite",
  "/auth",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.nextUrl.hostname;

  if (
    hostname.endsWith(".vercel.app") &&
    hostname !== PRODUCTION_HOST
  ) {
    const dest = request.nextUrl.clone();
    dest.hostname = PRODUCTION_HOST;
    dest.protocol = "https:";
    dest.port = "";
    return NextResponse.redirect(dest, request.method === "GET" ? 308 : 307);
  }

  if (pathname.startsWith("/auth/") && pathname !== "/auth/callback") {
    return NextResponse.next({ request });
  }

  if (request.nextUrl.searchParams.has("code") && pathname !== "/auth/callback") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/auth/callback";
    if (!dest.searchParams.get("next")) {
      dest.searchParams.set("next", "/switcher");
    }
    return NextResponse.redirect(dest);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as never),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/switcher";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
