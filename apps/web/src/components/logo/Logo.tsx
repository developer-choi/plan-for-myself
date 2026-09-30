interface LogoProps {
  size: number;
  backgroundColor?: string;
  markColor?: string;
}

export default function Logo({
  size,
  backgroundColor = 'var(--color-fg-primary)',
  markColor = 'var(--color-bg-primary)',
}: LogoProps) {
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

const MOCKUP_SIZE = 72;
const MOCKUP_RADIUS = 20;
const MOCKUP_MARK_SIZE = 42;
