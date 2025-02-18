"use client"
import dynamic from 'next/dynamic';
import GlobalConfig, { Resource } from "@/public/shared/app.config";
import UserProfileButton from '../sub-components/user-profile-button';
import { useEffect, useState } from 'react';

// const DynamicUserProfileButton = dynamic(() => import('../sub-components/user-profile-button'),
//   {
//     loading: () => <div className='mx-2 md:mx-4 p-2 md:p-3 h-[36px] md:h-[48px] md:w-[48px]'></div>,
//     ssr: false
//   });


const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`main-header relative z-20 -translate-y-full sticky ${isVisible ? 'sticky translate-y-0' : 'static'} top-0`}>
      <nav className="max-w-screen-2xl mx-auto px-3">
        <div className="flex flex-wrap items-center justify-between mx-auto py-3">
          <a href="/" className="mx-0 flex items-center space-x-3 h-[50px] md:h-[60px]">
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap">LOGO</span> */}
            <img src="/images/logo.png" className="w-auto h-full" />
          </a>
          <div className="flex items-center">
            <ul className="hidden md:flex font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:mt-0 md:border-0 gap-x-8 mr-0 md:mr-5">
              <li>
                <a href={Resource.BusinessListing.dashboardLink} className="hover-underline">{Resource.BusinessListing.label}</a>
              </li>
              <li>
                <a href={Resource.Advertisement.dashboardLink} className="hover-underline">{Resource.Advertisement.label}</a>
              </li>
            </ul>
            {/* <DynamicUserProfileButton /> */}
            <UserProfileButton />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header