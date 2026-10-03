'use client';

import {useRouter} from 'next/navigation';
import {ChevronLeftIcon} from '@radix-ui/react-icons';
import {IconButton} from '@developer-choi/design-system';

export default function LoginBackButton() {
  const router = useRouter();

  return <IconButton icon={<ChevronLeftIcon />} onClick={() => router.back()} />;
}
