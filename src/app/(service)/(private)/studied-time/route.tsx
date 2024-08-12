import {redirect} from 'next/navigation';

export function GET() {
  const date = new Date();
  redirect(`studied-time/${date.getFullYear()}/${date.getMonth() + 1}`);
}
