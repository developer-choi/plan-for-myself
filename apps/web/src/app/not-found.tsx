'use client';

import {useRouter} from 'next/navigation';
import ErrorScreen from '@/shared/components/ErrorScreen';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorScreen
      action={{children: '처음으로', onClick: () => router.push('/')}}
      content="주소가 잘못되었거나 변경되었을 수 있어요."
      title="페이지를 찾을 수 없어요"
    />
  );
}
