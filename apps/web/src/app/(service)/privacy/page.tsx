import type {ReactNode} from 'react';
import type {Metadata} from 'next';
import classNames from 'classnames';
import typography from '@developer-choi/design-system/styles/typography';
import Card from '@/shared/components/Card';
import SubPageHeader from '@/shared/components/SubPageHeader';
import layout from '@/shared/styles/layout.module.scss';
import styles from './page.module.scss';

interface PolicyItem {
  title: string;
  content: ReactNode;
}

interface PolicySectionProps {
  title: string;
  children: ReactNode;
}

interface EmailLinkProps {
  email: string;
}

export const metadata: Metadata = {
  title: '개인정보 처리방침',
};

export default function Page() {
  return (
    <div className={layout.shell}>
      <div className={layout.centered}>
        <SubPageHeader title="개인정보 처리방침" />
        <main className={styles.body}>
          <Card>
            <article className={typography.body2}>
              {POLICY_ITEMS.map(({title, content}) => (
                <PolicySection key={title} title={title}>
                  <p className={styles.content}>{content}</p>
                </PolicySection>
              ))}
              <PolicySection title="개인정보 보호책임자">
                <PrivacyOfficerContact />
              </PolicySection>
            </article>
          </Card>
        </main>
      </div>
    </div>
  );
}

const PRIVACY_OFFICER_NAME = '최유진';
const PRIVACY_OFFICER_EMAIL = 'forworkchoe@gmail.com';

const POLICY_ITEMS: PolicyItem[] = [
  {
    title: '수집하는 정보',
    content:
      '구글 계정 고유 ID(이메일·이름은 받지 않아요), 게스트 식별 쿠키, 직접 적은 기록(공부시간·실패 태그·날짜), 접속할 때의 IP 주소, 오류가 났을 때의 오류 정보(오류 내용과 코드 위치, 오류가 난 요청에 담긴 기록, 그때의 페이지 주소, 브라우저·OS 종류, 접속 IP로 추정한 국가·도시)',
  },
  {
    title: '쓰는 곳',
    content:
      '기록을 저장하고 통계를 보여주는 데 써요. 접속 IP는 웹 서버(Vercel)가 요청을 처리하고 공격을 막는 데, 그리고 한 곳에서 게스트를 한꺼번에 많이 만드는 것을 막는 데 써요. 오류 정보는 서비스에서 난 오류를 찾아 고치는 데 써요',
  },
  {
    title: '보관 기간',
    content:
      '회원 탈퇴나 기록 모두 지우기를 할 때까지 보관해요. 접속 IP는 우리 DB에는 남기지 않아요. 웹 서버(Vercel)의 접속 기록에 남는 IP는 Vercel 개인정보 처리방침의 보관 기준을 따라요. 오류 정보는 Sentry 요금제의 보관 기간(현재 30일)이 지나면 자동으로 지워져요',
  },
  {
    title: '지우는 방법',
    content:
      '탈퇴·지우기를 누르면 계정과 기록을 DB에서 바로 모두 지워요. 오류 정보는 계정과 이어 두지 않아 탈퇴할 때 함께 지우지 못하고, 보관 기간이 지나면 지워져요. 법령에 따라 따로 보존하는 정보는 없어요',
  },
  {title: '남에게 주는 정보', content: '없어요'},
  {
    title: '맡기는 곳',
    content: (
      <>
        웹 서버 호스팅은 Vercel, DB 호스팅은 Neon, 오류 수집은 Sentry에 맡겨요. Sentry가 다시 맡기는 곳은{' '}
        <a href="https://sentry.io/legal/subprocessors/">Sentry 하위 처리자 목록</a>에 있어요. 구글은 로그인 수단으로만
        써요
      </>
    ),
  },
  {
    title: '해외로 옮기는 정보',
    content: (
      <>
        위 정보는 서비스를 쓸 때마다 네트워크로 미국(Vercel Inc. · <EmailLink email="privacy@vercel.com" />, 웹 서버)과
        싱가포르(Neon을 운영하는 Databricks Inc. · <EmailLink email="privacy@databricks.com" />, DB)에 보내 보관해요.
        다만 접속 IP는 Neon(DB)에는 보내지 않고 Vercel에서만 처리해요. 오류 정보는 오류가 날 때마다 네트워크로
        미국(Sentry를 운영하는 Functional Software, Inc. · <EmailLink email="compliance@sentry.io" />, 오류 수집)에 보내
        보관해요. 이때 Sentry에 닿는 접속 IP는 국가·도시를 추정하는 데만 쓰고 저장하지 않아요. 쓰는 곳과 보관 기간은
        위와 같아요. 개인정보 보호법 제28조의8 제1항 제3호 가목에 따라 이 방침에 알리고 옮겨요. 옮기는 것을 거부하려면
        서비스를 쓰지 않거나 탈퇴하면 되고, 거부하면 서비스를 쓸 수 없어요
      </>
    ),
  },
  {
    title: '내 권리',
    content: '계정 페이지에서 직접 탈퇴·지우기를 할 수 있어요. 열람·정정은 아래 이메일로 요청해요',
  },
  {
    title: '쿠키',
    content:
      '쿠키는 브라우저에 저장돼 접속할 때 서버로 보내지는 작은 정보예요. 로그인·게스트 세션 쿠키와, 이미 가입된 계정 안내(10분)·게스트 기록 삭제 확인(5분)에 쓰는 짧은 쿠키를 써요. 짧은 쿠키에는 구글 계정 고유 ID를 서버 비밀키로 바꾼 값과 게스트 ID가 담기고, 시간이 지나면 사라져요. 로그인 안내 말풍선을 띄운 날짜는 브라우저 저장소에만 담고 서버로 보내지 않아요. 브라우저 설정에서 쿠키를 막을 수 있지만, 막으면 로그인과 기록을 쓸 수 없어요',
  },
  {
    title: '안전 조치',
    content:
      'HTTPS로 주고받고, 접속 비밀 값은 코드 저장소 밖 환경변수에 두며, 다른 사람의 기록에는 접근할 수 없게 막아요',
  },
];

function PolicySection({title, children}: PolicySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={classNames(typography.body2, typography.bold)}>{title}</h2>
      {children}
    </section>
  );
}

function PrivacyOfficerContact() {
  return (
    <address className={styles.content}>
      {PRIVACY_OFFICER_NAME} · <EmailLink email={PRIVACY_OFFICER_EMAIL} />
    </address>
  );
}

function EmailLink({email}: EmailLinkProps) {
  return <a href={`mailto:${email}`}>{email}</a>;
}
