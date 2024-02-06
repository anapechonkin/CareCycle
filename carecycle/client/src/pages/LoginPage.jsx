import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mobileHeaderStyle = {
    backgroundImage: `url('/photos/cv_atelier-ete1.jpg')`,
    backgroundSize: '100% auto', // Fit to width, height auto
    backgroundPosition: 'top center', // Position at the top
    backgroundRepeat: 'no-repeat',
    height: '40vh', // Adjust the height of the header image
    width: '100%',
  };

  const desktopBackgroundStyle = {
    backgroundImage: `url('/photos/cv_atelier-ete1.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh', // Full viewport height
    width: '100%',
  };

  const titleStyle = {
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.75)',
    fontFamily: "'CursiveFontName', sans-serif", // Replace 'CursiveFontName' with your font
    position: 'absolute',
    top: isMobile ? '20%' : '15%', // Slightly lower position for mobile
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    fontSize: 'calc(2vw + 1rem)', // Responsive font size
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen"
      style={isMobile ? { backgroundColor: '#f5f5f5' } : desktopBackgroundStyle} // Light grey background for mobile view
    >
      {/* Mobile Header Image */}
      {isMobile && (
        <div style={mobileHeaderStyle} />
      )}

      {/* Title with responsive font size and position */}
      <h1 
        className="text-white font-bold mb-10"
        style={titleStyle}
      >
        Atelier Culture Velo
      </h1>
      
      {/* LoginForm */}
      <div className="w-full" style={{ marginTop: isMobile ? '-3rem' : '0' }}> {/* Adjust the top margin for mobile */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
