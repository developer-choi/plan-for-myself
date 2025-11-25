'use server';

import {revalidatePath, revalidateTag} from 'next/cache';

export async function revalidateTagOnServerAction(tag: string) {
  revalidateTag(tag);
}

export async function revalidatePathOnServerAction(path: string) {
  revalidatePath(path);
}
