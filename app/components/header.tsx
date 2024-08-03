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
    <header style={{backgroundColor: "rgb(26, 26, 26)"}} className="relative z-20 border-gray-200 sticky top-0">
      <nav className="max-w-screen-xl mx-auto px-3">
        <div className="flex flex-wrap items-center justify-between mx-auto py-3">
          <a href="/" className="mx-2 md:mx-4 flex items-center space-x-3 h-[80px]">
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap">LOGO</span> */}
            <img src="/images/logo3.png" className="w-full h-full" />
          </a>
          <div className="flex items-center">
            <ul className="hidden md:flex font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <a href={Resource.BusinessListing.dashboardLink} className="link-pill">{Resource.BusinessListing.label}</a>
              </li>
              <li>
                <a href={Resource.Advertisement.link} className="link-pill">{Resource.Advertisement.label}</a>
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