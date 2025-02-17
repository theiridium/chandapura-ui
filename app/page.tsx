import Hero from "./components/hero";
import MidSection from "./components/mid-section";
import SearchSection from "./components/search-section";
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      {/* <Test /> */}
      {/* <div className="lg:max-w-screen-xl lg:mx-auto lg:px-3"> */}
      <div className="max-w-screen-xl mx-auto">
        <Hero />
      </div>
      <div className="max-w-screen-xl mx-auto px-3 mb-12 md:mb-20">
        <SearchSection />
      </div>
      <MidSection />
    </>
  );
}
