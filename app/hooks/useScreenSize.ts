import { useState, useEffect, useLayoutEffect } from 'react';
import GobalConfig from "../../public/shared/app.config";
// import Cookies from 'js-cookie';


const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    width: typeof window !== 'undefined' ? window.innerWidth : null,
    height: typeof window !== 'undefined' ? window.innerHeight : null,
  });

  const setWidthAttributes = (size: string, width: number, height: number) => {
    setScreenSize({
      sm: size === 'sm',
      md: size === 'md',
      lg: size === 'lg',
      xl: size === 'xl',
      xxl: size === 'xxl',
      width: width,
      height: height,
    });
    // Cookies.set('ScreenSize', size);
    // Cookies.set('ScreenWidth', `${width}`);
  }
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width <= GobalConfig.sm) setWidthAttributes('sm', width, height);
      else if (width <= GobalConfig.md && width > GobalConfig.sm) setWidthAttributes('md', width, height);
      else if (width <= GobalConfig.lg && width > GobalConfig.md) setWidthAttributes('lg', width, height);
      else if (width <= GobalConfig.xl && width > GobalConfig.lg) setWidthAttributes('xl', width, height);
      else if (width > GobalConfig.xl) setWidthAttributes('xxl', width, height);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;