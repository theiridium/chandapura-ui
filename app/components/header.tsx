import dynamic from 'next/dynamic';
import GlobalConfig, { Resource } from "@/public/shared/app.config";
import UserProfileButton from '../sub-components/user-profile-button';

const DynamicUserProfileButton = dynamic(() => import('../sub-components/user-profile-button'),
  {
    loading: () => <div className='mx-2 md:mx-4 p-2 md:p-3 h-[36px] md:h-[48px] md:w-[48px]'></div>,
    ssr: false
  });

const Header = () => {
  return (
    <header className="main-header relative z-20 sticky top-0">
      <nav className="max-w-screen-xl mx-auto px-3">
        <div className="flex flex-wrap items-center justify-between mx-auto py-3">
          <a href="/" className="mx-0 flex items-center space-x-3 h-[60px]">
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap">LOGO</span> */}
            <img src="/images/logo3.png" className="w-full h-full" />
          </a>
          <div className="flex items-center">
            <ul className="hidden md:flex font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:mt-0 md:border-0 gap-x-8 mr-0 md:mr-5">
              <li>
                <a href={Resource.BusinessListing.dashboardLink} className="hover-underline">{Resource.BusinessListing.label}</a>
              </li>
              <li>
                <a href={Resource.Advertisement.link} className="hover-underline">{Resource.Advertisement.label}</a>
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