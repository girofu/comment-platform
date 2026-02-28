import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - _next/static (靜態資源)
     * - _next/image (圖片優化)
     * - favicon.ico, sitemap.xml, robots.txt (metadata 檔案)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
