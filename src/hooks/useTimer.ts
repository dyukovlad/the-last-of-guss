import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime: number = Date.now()): [number, () => void] => {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const intervalRef = useRef<number | null>(null); // Using number for setTimeout ID

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    setCurrentTime(Date.now());
    intervalRef.current = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  };

  return [currentTime, resetTimer];
};