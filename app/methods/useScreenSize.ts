import { useState, useEffect, useLayoutEffect } from 'react';
import GobalConfig from "../../public/shared/app.config";
// import Cookies from 'js-cookie';

const setScreenParameter = () => {
  let screenParameters = {
    sm: false,
    md: false,
    lg: false,
    xl: false,
    xxl: false,
    width: typeof window !== 'undefined' ? window.innerWidth : null,
    height: typeof window !== 'undefined' ? window.innerHeight : null,
  }
  const setScreenValues = (size: string, width: number, height: number) => {
    screenParameters.sm = size === 'sm';
    screenParameters.md = size === 'md';
    screenParameters.lg = size === 'lg';
    screenParameters.xl = size === 'xl';
    screenParameters.xxl = size === 'xxl';
    screenParameters.width = width;
    screenParameters.height = height;
  };
  const handleResize = () => {
    const width: any = typeof window !== 'undefined' && window.innerWidth;
    const height: any = typeof window !== 'undefined' && window.innerHeight;
    if (width <= GobalConfig.sm) setScreenValues('sm', width, height);
    else if (width <= GobalConfig.md && width > GobalConfig.sm) setScreenValues('md', width, height);
    else if (width <= GobalConfig.lg && width > GobalConfig.md) setScreenValues('lg', width, height);
    else if (width <= GobalConfig.xl && width > GobalConfig.lg) setScreenValues('xl', width, height);
    else if (width > GobalConfig.xl) setScreenValues('xxl', width, height);
  };
  handleResize();
  typeof window !== 'undefined' && window.addEventListener('resize', handleResize);
  return screenParameters;
};

export default setScreenParameter;