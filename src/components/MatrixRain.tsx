import React, { useEffect, useRef } from 'react';

const MATRIX_CHARACTERS = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・.";=*+-<>¦｜╌ﾘ';

interface MatrixRainProps {
  className?: string;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    let lastFrame = 0;
    const frameInterval = 50; // Increase this value to slow down the animation (milliseconds)
    
    // Animation loop
    let animationFrameId: number;
    const draw = (timestamp: number) => {
      // Only update every frameInterval milliseconds
      if (timestamp - lastFrame >= frameInterval) {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#0F0';
        context.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          // Only update some drops each frame for a more varied effect
          if (Math.random() > 0.1) continue; // 90% chance to skip updating each drop

          const text = MATRIX_CHARACTERS.charAt(
            Math.floor(Math.random() * MATRIX_CHARACTERS.length)
          );
          
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          
          // Add glow effect
          context.shadowBlur = 4;
          context.shadowColor = '#0F0';
          context.fillText(text, x, y);
          context.shadowBlur = 0;

          // Slower reset of drops
          if (y > canvas.height && Math.random() > 0.99) { // Reduced chance to reset
            drops[i] = 0;
          }
          drops[i] += 0.5; // Reduced drop speed (was 1)
        }
        lastFrame = timestamp;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${className}`}
      style={{ 
        opacity: 0.7,
        zIndex: 0,
        background: 'transparent'
      }}
    />
  );
};