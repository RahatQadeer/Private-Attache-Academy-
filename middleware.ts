import { type NextRequest } from "next/server";
import { updateSession } from "@/base/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/google|auth/login|auth/signup|auth/otp|auth/forgot-password|auth/reset-password|auth/sign-out|auth/accept-invite|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
