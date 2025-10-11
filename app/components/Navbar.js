"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import UserDashboard from './UserDashboard';

function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isLaws = pathname === '/laws';
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const headerStyles = {
    position:'absolute', 
    left:'50%', 
    top:'12px', 
    transform:'translateX(-50%)', 
    zIndex:20, 
    width:'100%', 
    maxWidth:'72rem'
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
        <style>{`header nav a:hover { color: #9DA4A8 !important; }`}</style>
        <nav style={{
          display:'flex', 
          alignItems:'center', 
          justifyContent:'space-between', 
          width:'100%',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '120px' }}>
            <Link href="/" style={{display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
              <img
                src="/UXLab.webp"
                alt="UXLab Logo"
                height={36}
                style={{width:'auto', display:'block'}}
                draggable={false}
              />
            </Link>      

            <Link 
              href="/" 
              style={{
                color:'#ffffff', 
                textDecoration:'none', 
                fontSize:'16px', 
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#8eb940' }}>
                  {user.email}
                </span>                
                <button
                  onClick={() => setShowDashboard(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#8eb940',
                  color: '#000',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            )}
          </div>
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