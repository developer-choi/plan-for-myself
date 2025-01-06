'use server';

import {revalidateTag} from 'next/cache';
import {RevalidateTagType} from '@/utils/extend/library/fetch';

export async function revalidateTagOnServerAction(tag: RevalidateTagType) {
  revalidateTag(tag);
}
