import { NextRequest, NextResponse } from "next/server";

const publicPath = /^\/(?:$|berita(?:\/.*)?$|agenda\/?$|peta\/?$)/;
const localePath = /^\/(id|en)(?=\/|$)/;

function preferredLocale(request: NextRequest) {
  const saved = request.cookies.get("sapen_locale")?.value;
  if (saved === "id" || saved === "en") return saved;
  const accepted = (request.headers.get("accept-language") || "")
    .split(",")
    .map((entry) => {
      const [tag, quality] = entry.trim().toLowerCase().split(";q=");
      return { locale: tag.split("-")[0], quality: quality ? Number(quality) : 1 };
    })
    .filter((entry) => (entry.locale === "id" || entry.locale === "en") && entry.quality > 0)
    .sort((left, right) => right.quality - left.quality);
  return accepted[0]?.locale || "id";
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(localePath);
  if (!match && !publicPath.test(pathname)) return NextResponse.next();

  const locale = match?.[1] || preferredLocale(request);
  const pathWithoutLocale = match ? pathname.replace(localePath, "") || "/" : pathname;

  if (!match) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    return NextResponse.redirect(destination);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-sapen-locale", locale);
  requestHeaders.set("x-sapen-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[^/]+$).*)"],
};
