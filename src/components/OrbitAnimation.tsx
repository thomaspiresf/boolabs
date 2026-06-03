import React, { useEffect, useRef, useState } from 'react';

const centerImages = [
  '/Frame-36.svg', '/Button-3.svg', '/Button-4.svg', '/Button-2.svg', '/Button.svg', '/Button-1.svg'
];

const iconPool = [
  '/bar-chart-1.svg', 
  '/bar-chart-2.svg', 
  '/laptop.svg', '/program.svg', '/radar.svg', '/rocket.svg', '/grid.svg', '/chart.svg', '/data.svg'
];

const ghostPool = ['/Button.svg', '/Button-1.svg', '/Button-3.svg', '/Button-4.svg', '/Button-2.svg'];

const scaleLimits = {
  ghost: { min: 0.60, max: 1.65 },
  icon:  { min: 0.40, max: 0.90 }
};

const satellitesData = [
  { type: 'ghost' as const, src: '/Button.svg',   baseSize: 130, angleDeg: 190, distance: 185, cluster: 1 },
  { type: 'ghost' as const, src: '/Button-1.svg', baseSize: 110, angleDeg: 270, distance: 165, cluster: 2 },
  { type: 'icon' as const,  src: '/bar-chart-1.svg', baseSize: 60, angleDeg: 335, distance: 175, cluster: 3 }, 
  { type: 'ghost' as const, src: '/Button-3.svg', baseSize: 120, angleDeg: 8,   distance: 185, cluster: 3 }, 
  { type: 'ghost' as const, src: '/Button-4.svg', baseSize: 115, angleDeg: 80,  distance: 185, cluster: 4 },
  { type: 'icon' as const,  src: '/bar-chart-2.svg', baseSize: 60, angleDeg: 155, distance: 205, cluster: 5 }, 
  { type: 'ghost' as const, src: '/Button-2.svg', baseSize: 110, angleDeg: 125, distance: 175, cluster: 5 }  
];

const OrbitAnimation: React.FC = () => {
  const [currentCenterIndex, setCurrentCenterIndex] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [satIcons, setSatIcons] = useState(satellitesData.map(d => d.src));
  const satellitesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>(null);
  const rotationRef = useRef(0);

  const floatOffsets = useRef<number[]>(satellitesData.map(() => Math.random() * Math.PI * 2));

  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Use a ref to track the current icons to avoid dependency loops in setInterval
  const satIconsRef = useRef(satellitesData.map(d => d.src));

  useEffect(() => {
    const swapInterval = setInterval(() => {
      setIsSwapping(true);
      
      setTimeout(() => {
        setCurrentCenterIndex(prev => {
          const nextIndex = (prev + 1) % centerImages.length;
          const nextCenterImage = centerImages[nextIndex];

          // Icon selection logic
          const currentIcons = satIconsRef.current;
          const availableIcons = iconPool.filter(icon => !currentIcons.includes(icon));
          const selectedIcons = shuffleArray(availableIcons).slice(0, 2);
          let iconIdx = 0;

          // Ghost logic - ensure icons don't overlap with their current state (blindado)
          let ghostsToAssign = ghostPool.map(g => g === nextCenterImage ? '/boo.svg' : g);
          const ghostIndices = satellitesData.map((s, i) => s.type === 'ghost' ? i : -1).filter(i => i !== -1);
          const currentGhosts = ghostIndices.map(i => currentIcons[i]);

          let attempts = 15;
          while(attempts > 0) {
            ghostsToAssign = shuffleArray(ghostsToAssign);
            let hasOverlap = false;
            for(let i = 0; i < currentGhosts.length; i++) {
              if(ghostsToAssign[i] === currentGhosts[i]) {
                hasOverlap = true;
                break;
              }
            }
            if(!hasOverlap) break;
            attempts--;
          }
          let ghostIdx = 0;

          const nextIcons = satellitesData.map((sat) => {
            if (sat.type === 'ghost') {
              return ghostsToAssign[ghostIdx++];
            } else {
              return selectedIcons[iconIdx++] || sat.src;
            }
          });

          satIconsRef.current = nextIcons;
          setSatIcons(nextIcons);
          return nextIndex;
        });
        
        setIsSwapping(false);
      }, 300);
    }, 3500);

    return () => clearInterval(swapInterval);
  }, []);

  const animate = () => {
    rotationRef.current += 0.0020;
    
    satellitesRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const data = satellitesData[i];
      const baseAngle = data.angleDeg * (Math.PI / 180);
      const currentAngle = baseAngle + rotationRef.current;
      
      const x = Math.cos(currentAngle) * data.distance;
      const y = Math.sin(currentAngle) * data.distance;
      const floatY = Math.sin(rotationRef.current * 15 + floatOffsets.current[i]) * 3;
      
      const limits = scaleLimits[data.type];
      const positionScale = limits.min + (Math.abs(Math.cos(currentAngle)) * (limits.max - limits.min));
      const finalCSSScale = positionScale / limits.max;

      // depth logic: O Z-Index dos satélites agora varia apenas de 10 a 110.
      const depth = Math.sin(currentAngle);
      const dynamicZ = Math.round((depth + 1) * 50) + 10;
      const clusterOffset = data.type === 'ghost' ? 5 : 0;
      
      ref.style.zIndex = (dynamicZ + clusterOffset).toString();
      ref.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y + floatY}px)) scale(${finalCSSScale})`;
    });
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative w-[360px] h-[220px] md:w-[420px] md:h-[300px] mb-0 flex items-center justify-center scale-[0.4] md:scale-[0.55]">
      {/* Center Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[280px] md:h-[280px] z-[1000]">
        <div className="relative w-full h-full flex items-center justify-center">
          {centerImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute w-full h-full object-contain transition-all duration-800 ${
                i === currentCenterIndex 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-60 pointer-events-none'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Satellites */}
      {satellitesData.map((sat, i) => (
        <div
          key={i}
          ref={el => satellitesRefs.current[i] = el}
          className="absolute top-1/2 left-1/2 will-change-transform"
          style={{ 
            width: sat.baseSize * scaleLimits[sat.type].max, 
            height: sat.baseSize * scaleLimits[sat.type].max, 
          }}
        >
          <img
            src={satIcons[i]}
            alt=""
            className={`block w-full h-full rounded-full transition-all duration-400 ${
              isSwapping ? 'opacity-0 scale-20' : 'opacity-100 scale-100'
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default OrbitAnimation;
