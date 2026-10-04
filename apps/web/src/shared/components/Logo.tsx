interface LogoProps {
  size: keyof typeof LOGO_SIZE;
  backgroundColor?: string;
  markColor?: string;
}

export default function Logo({
  size: sizeName,
  backgroundColor = 'var(--color-primary)',
  markColor = 'var(--color-on-primary)',
}: LogoProps) {
  const size = LOGO_SIZE[sizeName];
  const markSize = (size * MOCKUP_MARK_SIZE) / MOCKUP_SIZE;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: (size * MOCKUP_RADIUS) / MOCKUP_SIZE,
        backgroundColor,
      }}
    >
      <svg
        fill="none"
        height={markSize}
        stroke={markColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        viewBox="0 0 24 24"
        width={markSize}
      >
        <path d="M6 21V4" />
        <path d="M6 4.5c3-1.6 5.5 1.6 8.5 0s3.5-.5 3.5-.5v8.5s-.5-1.1-3.5.5-5.5-1.6-8.5 0" fill={markColor} />
      </svg>
    </div>
  );
}

export const LOGO_SIZE = {medium: 32, large: 52} as const;

const MOCKUP_SIZE = 72;
const MOCKUP_RADIUS = 20;
const MOCKUP_MARK_SIZE = 42;
