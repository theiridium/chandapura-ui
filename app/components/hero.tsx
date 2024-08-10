import { getPublicApiResponse } from "@/lib/apiLibrary";
import AdBanner from "../sub-components/ad-banner"
import SideCategorySection from "./side-category-section"
import { Products } from "@/public/shared/app.config";
import { Suspense } from "react";
import AdLoading from "../loading-components/ad-loading";

const Hero = async () => {
  // const attr = Products.advertisement.api;
  // const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3A${attr.sort}&${attr.populate}`);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 mt-3 lg:mt-10 relative gap-5 lg:gap-10">
      <div className="col-span-1 lg:col-span-full">
        <Suspense fallback={<AdLoading />}>
          <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
        </Suspense>
      </div>
      {/* <div className="col-span-1 lg:col-span-3">
        <SideCategorySection />
      </div> */}
    </div>
  )
}

export default Hero