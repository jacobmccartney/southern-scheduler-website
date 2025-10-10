import { useEffect, useState } from "react";

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onLoadingComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
      }}
    >
      <div className="relative">
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative text-center">
          <h1 
            className="text-6xl font-bold mb-4 animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #8800FF 0%, #FF00F6 50%, #0900FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Welcome to
          </h1>
          <h2 
            className="text-7xl font-bold animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #0900FF 0%, #8800FF 50%, #FF00F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animationDelay: '0.3s'
            }}
          >
            Southern Scheduler!
          </h2>
          
          {/* Orbiting planets */}
          <div className="mt-12 relative w-32 h-32 mx-auto">
            <div 
              className="absolute w-4 h-4 rounded-full animate-spin"
              style={{
                background: '#8800FF',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                animationDuration: '3s'
              }}
            />
            <div 
              className="absolute w-3 h-3 rounded-full animate-spin"
              style={{
                background: '#FF00F6',
                bottom: '0',
                right: '0',
                animationDuration: '2s',
                animationDirection: 'reverse'
              }}
            />
            <div 
              className="absolute w-3 h-3 rounded-full animate-spin"
              style={{
                background: '#0900FF',
                bottom: '0',
                left: '0',
                animationDuration: '2.5s'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
