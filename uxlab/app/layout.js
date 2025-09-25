import localFont from 'next/font/local';

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.ttf',
  display: 'swap',
  variable: '--font-satoshi', 
});

export const metadata = {
  title: 'UXLab',
  description: 'Learn UX Laws by Doing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${satoshi.className}`}
        style={{
          backgroundImage: 'radial-gradient(80% 80% at 50% 50%, #1A1A1A 10%, #000000 100%)',
          backgroundColor: '#000000',
          minHeight: '100vh',
          color: '#ffffff',
          margin: 0,
          padding: 0
        }}
      >
        {children}
        <footer
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            textAlign: 'right',
            color: '#9DA4A8',
            fontSize: '16px',
            width: 'auto',
            padding: '12px 24px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          © Lidya Marthadilla. All rights reserved.
        </footer>
      </body>
    </html>
  );
}