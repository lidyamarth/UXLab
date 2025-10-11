"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import UserDashboard from './UserDashboard';

function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isLaws = pathname === '/laws';
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerStyles = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    width: 'auto',
    transition: 'all 0.3s ease-in-out',
    top: isScrolled ? '16px' : '16px',
    padding: isScrolled ? '8px 24px' : '0px',
    backgroundColor: isScrolled ? 'rgba(41, 41, 41, 0.7)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
    borderRadius: isScrolled ? '18px' : '0px',
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      <header style={headerStyles}>
        <style>{`header nav a:hover, header nav button:hover { color: #9DA4A8 !important; }`}</style>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '62px'
        }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/UXLab.webp"
              alt="UXLab Logo"
              height={36}
              style={{ width: 'auto', display: 'block' }}
              draggable={false}
            />
          </Link>

          <Link
            href="/"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: isHome ? 500 : 400,
              fontStyle: isHome ? 'italic' : 'normal'
            }}
          >
            Home
          </Link>

          {user && (
            <Link
              href="/laws"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: isLaws ? 500 : 400,
                fontStyle: isLaws ? 'italic' : 'normal'
              }}
            >
              Laws
            </Link>
          )}

          {user ? (
            <>
              <button
                onClick={() => setShowDashboard(true)}
                style={{
                  background: 'none', border: 'none', color: '#ffffff',
                  textDecoration: 'none', fontSize: '16px', cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '5px 12px', borderRadius: '12px', backgroundColor: '#8eb940',
                  boxShadow: '4px 4px 20px rgba(255,255,255,0.10), inset 0 4px 24px rgba(232,244,98,1), inset 4px 0 24px rgba(232,244,98,1)',
                  color: '#000000', border: '2.5px solid #555', fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
                style={{
                  padding: '5px 12px', borderRadius: '12px', backgroundColor: '#8eb940',
                  boxShadow: '4px 4px 20px rgba(255,255,255,0.10), inset 0 4px 24px rgba(232,244,98,1), inset 4px 0 24px rgba(232,244,98,1)',
                  color: '#000000', border: '2.5px solid #555', fontSize: '15px',
                  cursor: 'pointer'
              }}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <UserDashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </>
  );
}

export default Navbar;