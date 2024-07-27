import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {auth, CURRENT_URL_IN_HEADER} from '@/util/sevices/auth';
import {customFetchInBothSide, ExtendedCustomFetchParameter} from '@/util/extend/api/both';
import {LoginError} from '@/util/sevices/auth/redirect';

export async function customFetchInServerSide(input: string | URL | globalThis.Request, parameter: ExtendedCustomFetchParameter) {
  try {
    console.log('request on server', input);
    const session = await auth();
    const result = await customFetchInBothSide(input, {...parameter, session});
    console.log('response on server', result.json);
    return result;
  } catch (error: any) {
    console.log('error occurred on server', error.message);

    if (error instanceof LoginError) {
      const currentUrl = headers().get(CURRENT_URL_IN_HEADER) ?? '/'; // middleware에서 셋팅
      redirect(`/api/next-auth/logout?redirect=${currentUrl}`);

    } else {
      throw error;
    }
  }
}
