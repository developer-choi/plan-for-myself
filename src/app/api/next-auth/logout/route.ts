import {NextRequest} from "next/server";
import {redirect} from "next/navigation";
import {signOut} from '@/utils/service/auth';

// Server Component에서 로그아웃 하기위한 Route Handler
export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.searchParams.get("redirect") ?? '/';

  try {
    await signOut({
      redirect: false
    });
  } catch (error) {
    await signOut({
      redirect: false
    });
    throw error;
  }

  redirect(`/guest/login?redirect=${encodeURIComponent(redirectUrl)}`)
}
