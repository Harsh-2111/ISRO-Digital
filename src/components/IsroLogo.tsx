import React from 'react';

interface IsroLogoProps {
  className?: string;
  size?: number;
}

export const IsroLogo: React.FC<IsroLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Deep Space Blue Sphere representing Earth */}
      <circle cx="50" cy="50" r="42" fill="#0E2356" />
      <circle cx="50" cy="50" r="42" fill="url(#globeGlow)" />
      
      {/* Parallels (Latitude lines) */}
      <path d="M12 40 C 30 45, 70 45, 88 40" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M8 50 C 30 55, 70 55, 92 50" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M12 60 C 30 65, 70 65, 88 60" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
      
      {/* Meridians (Longitude lines) */}
      <path d="M50 8 C 44 30, 44 70, 50 92" stroke="#38BDF8" strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M50 8 C 28 30, 28 70, 50 92" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M50 8 C 72 30, 72 70, 50 92" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />

      {/* Orbit Trail */}
      <ellipse cx="50" cy="48" rx="36" ry="14" stroke="#FFC107" strokeWidth="1.8" transform="rotate(-15 50 48)" strokeDasharray="140" strokeDashoffset="10" />

      {/* Orange Rocket Body Vector pointing upwards-right */}
      <path 
        d="M32 72 C 34 62, 54 42, 65 31 C 68 28, 72 25, 74 26 C 75 28, 72 32, 69 35 C 58 46, 38 66, 28 68 Z" 
        fill="#FF7A00" 
      />
      
      {/* Bright Yellow flame and thrust trails */}
      <path 
        d="M28 68 C 24 71, 20 74, 15 76 C 18 71, 23 68, 28 68 Z" 
        fill="#FF3D00" 
      />
      <path 
        d="M30 70 L 22 75 L 25 71 Z" 
        fill="#FFC107" 
      />
      
      {/* Dynamic Solar panel sweeps flanking the rocket path */}
      <path d="M42 54 L 54 50 L 52 46 Z" fill="#38BDF8" />
      <path d="M48 60 L 60 56 L 58 52 Z" fill="#38BDF8" />

      {/* Glowing White Rocket tip/thruster core */}
      <path d="M62 34 L 66 30 L 64 35 Z" fill="#FFFFFF" />

      {/* Gradient definitions */}
      <defs>
        <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0B132B" stopOpacity="0.9" />
        </radialGradient>
      </defs>
    </svg>
  );
};
