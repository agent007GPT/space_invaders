import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (deltaTime: number) => void, frameRate: number) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  useEffect(() => {
    let accumulator = 0;
    const timeStep = frameRate;
    
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        accumulator += deltaTime;
        
        while (accumulator >= timeStep) {
          callback(timeStep);
          accumulator -= timeStep;
        }
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, frameRate]);
}