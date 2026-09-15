import { useState, useEffect } from 'react';

const ReviewButton = () => {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <a
      href="https://www.google.com/maps/place/?q=place_id:0x89e529970477bc27:0x3d37406d51e5cec&action=write-review"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        right: '20px',
        bottom: isMobile ? '80px' : '90px',
        zIndex: 998,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#FFFFFF',
        border: '1.5px solid #E8E2D8',
        borderRadius: '50px',
        padding: hovered ? '10px 18px' : '10px 12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        maxWidth: hovered ? '200px' : '44px',
      }}
    >
      {/* Google G colorido */}
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>

      {/* Estrelas + texto: aparecem no hover */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter', lineHeight: 1.2 }}>
          Leave a Review
        </span>
        <span style={{ fontSize: '13px', letterSpacing: '-1px' }}>⭐⭐⭐⭐⭐</span>
      </div>
    </a>
  );
};

export default ReviewButton;
