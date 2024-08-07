import React from 'react';
import {Metadata, ServerComponentProps} from 'next';
import {redirect} from 'next/navigation';
import ReviewKeywordsPage from '@/app/(service)/tool/review-keywords/client';
import {convertLegacyKeywordIfLegacy, KEYWORD_KEY} from '@/util/sevices/review-keywords/core';

export const metadata: Metadata = {
  title: '키워드 복습',
};

function checkedRedirect({searchParams}: ServerComponentProps) {
  const redirectQueryValue = convertLegacyKeywordIfLegacy(searchParams);

  if (!redirectQueryValue) {
    return;
  }

  redirect(`/tool/review-keywords?${KEYWORD_KEY}=${redirectQueryValue}`);
}

export default function Home(props: ServerComponentProps) {
  checkedRedirect(props);

  return (
    <ReviewKeywordsPage/>
  );
}
