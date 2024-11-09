import {redirect} from 'next/navigation';

export const revalidate = 0;

export function GET() {
  const date = new Date();
  redirect(`studied-time/${date.getFullYear()}/${date.getMonth() + 1}`);
}
