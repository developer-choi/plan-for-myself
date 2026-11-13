'use client';

import {useRouter} from 'next/navigation';
import {ENTRY_LABEL} from '@plan-for-myself/shared/label';
import {ENTRY_URL} from '@/auth/redirect';
import ErrorNotice from '@/shared/components/ErrorNotice';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorNotice
      action={{children: ENTRY_LABEL, onClick: () => router.push(ENTRY_URL)}}
      content="주소가 잘못되었거나 변경되었을 수 있어요."
      title="페이지를 찾을 수 없어요"
    />
  );
}
