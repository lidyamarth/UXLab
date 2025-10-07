"use client";

const Footer = () => {
  const footerStyles = {
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
    pointerEvents: 'all',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease'
  };
  
  return (
    <footer
      style={footerStyles} 
      onClick={() => window.open('https://linkedin.com/in/lidyamartha', '_blank')}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        e.target.style.color = '#ffffff';
        e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
        e.target.style.color = '#9DA4A8';
        e.target.style.transform = 'translateY(0)';
      }}
    >
      © Lidya Marthadilla. All rights reserved.
    </footer>
  );
};

export default Footer;
