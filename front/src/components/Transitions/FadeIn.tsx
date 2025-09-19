import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  duration = 800, 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
};

export default FadeIn;
