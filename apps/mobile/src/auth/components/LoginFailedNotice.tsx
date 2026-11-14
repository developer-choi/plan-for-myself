import LoginNotice from '@/auth/components/LoginNotice';

interface LoginFailedNoticeProps {
  notice: {title: string; content: string};
}

export default function LoginFailedNotice({notice}: LoginFailedNoticeProps) {
  return <LoginNotice title={notice.title}>{notice.content}</LoginNotice>;
}
