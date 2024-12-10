import { Products } from "@/public/shared/app.config"
import EmblaCarousel from "../components/embla-carousel/embla-carousel"
import { EmblaOptionsType } from 'embla-carousel'
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { getPublicApiResponse } from "@/lib/apiLibrary"

const OPTIONS: EmblaOptionsType = { loop: true }

const AdBanner = async ({ placement }: any) => {
  const currentDate = new Date();
  const attr = Products.advertisement.api;
  const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3A${attr.sort}&${attr.populate}&${attr.isPublishedFilter}&${attr.filter}=${currentDate.toISOString()}`);
  let adBannerList: any = []
  let urls: any = []
  res.data.forEach((x: any) => {
    let addBanner: any = {}
    addBanner.src = x.ad_image.url;
    addBanner.alt = x.ad_image.alternativeText;
    adBannerList.push(addBanner);
    urls.push(x.website);
  });

  const SLIDES = Array.from(adBannerList, (x: any, i) => <img className="h-[200px] md:h-[384px] object-cover" key={i} src={x.src} alt={x.alt} />)
  return (
    <div className={placement}>
      <div>
        <EmblaCarousel bg="bg-gray-200" height={'h-[200px] md:h-[384px]'} slides={SLIDES} options={OPTIONS} isAutoplay={true} urls={urls} />
      </div>
    </div>
  )
}

export default AdBanner