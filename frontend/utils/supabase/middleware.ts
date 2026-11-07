import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 1. Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isHodRoute = pathname.startsWith("/hod");
  const isLecturerRoute = pathname.startsWith("/lecturer");

  // 2. If trying to access protected routes without logging in, kick to home (sign in)
  if (!user && (isHodRoute || isLecturerRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 3. If the user IS logged in, fetch their role and enforce route boundaries
  if (user) {
    // Fetch custom role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role; // "lecturer" or "hod"

    // If a logged-in user visits the root page (Sign In/Up), redirect to their respective home
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = role === "hod" ? "/hod/home" : "/lecturer/home";
      return NextResponse.redirect(url);
    }

    // If a Lecturer tries to access HOD pages, kick them to Lecturer home
    if (isHodRoute && role !== "hod") {
      const url = request.nextUrl.clone();
      url.pathname = "/lecturer/home";
      return NextResponse.redirect(url);
    }

    // If an HOD tries to access Lecturer pages, kick them to HOD home
    if (isLecturerRoute && role !== "lecturer") {
      const url = request.nextUrl.clone();
      url.pathname = "/hod/home";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};
