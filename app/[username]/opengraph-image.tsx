import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LinkVM Creator Bio Link';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const cleanUsername = username ? username.replace(/^@/, '') : 'creator';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 20px',
            borderRadius: '100px',
            marginBottom: '24px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#818CF8',
          }}
        >
          linkvm.online/{cleanUsername}
        </div>

        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          @{cleanUsername} on LinkVM
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#94A3B8',
            maxWidth: '700px',
            textAlign: 'center',
          }}
        >
          All your links, social channels, tip jar, and digital content in one place. 100% Free Forever.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
