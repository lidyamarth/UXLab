import localFont from 'next/font/local';
import Footer from './components/Footer';

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
        <Footer />
      </body>
    </html>
  );
}