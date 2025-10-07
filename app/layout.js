import localFont from 'next/font/local';
import Footer from './components/Footer';
import ClientAuthProvider from './components/ClientAuthProvider';

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.ttf',
  display: 'swap',
  variable: '--font-satoshi', 
});

export const metadata = {
  title: 'UXLab',
  description: 'Learn UX Laws by Doing',
  icons: {
    icon: '/iconUXLab.svg',
  }
};

function RootLayout({ children }) {
  const bodyStyles = {
    backgroundImage: 'radial-gradient(80% 80% at 50% 50%, #1A1A1A 10%, #000000 100%)',
    backgroundColor: '#000000',
    minHeight: '100vh',
    color: '#ffffff',
    margin: 0,
    padding: 0
  };

  return (
    <html lang="en">
      <body className={satoshi.className} style={bodyStyles}>
        <ClientAuthProvider>
          {children}
          <Footer />
        </ClientAuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;