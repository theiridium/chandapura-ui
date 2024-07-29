import Hero from "./components/hero";
import MidSection from "./components/mid-section";
import SearchSection from "./components/search-section";

export default function Home() {
  return (
    <>
      {/* <Test /> */}
      <div className="max-w-screen-xl mx-auto px-3">
        <Hero />
      </div>
      <div className="max-w-screen-xl mx-auto px-3 mb-12 md:mb-20">
        <SearchSection />
      </div>
      <MidSection />
    </>
  );
}
