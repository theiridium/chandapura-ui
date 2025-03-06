import Rent from "../route-components/real-estate/rent/rent"
import Sale from "../route-components/real-estate/sale/sale"
import Business from "../route-components/business/business"
import Classifieds from "../route-components/classifieds/classifieds"
import { MoveRight } from "lucide-react"
import { Resource } from "@/public/shared/app.config"
import Jobs from "../route-components/jobs/jobs"


const MidSection = () => {
  return (
    <div className="pb-10">
      <div id="section-1">
        <Business />
      </div>
      <Rent />
      <Sale />
      <div id="section-4">
        <div className="max-w-screen-xl mx-auto px-3">
          <div className="flex items-center">
            <div>
              <h3 className="text-md sm:text-lg md:text-xl md:text-3xl lg:text-4xl font-medium leading-relaxed md:!leading-[3.5rem]">
                Why Store It? When you can Sell It for <span className="text-highlight-primary">Free</span> on <span className="text-highlight">Chandapura.com</span>!
              </h3>
              <a href={Resource.ClassifiedListing.dashboardLink} className="text-wrap sm:text-nowrap text-color1d text-sm md:text-lg mt-3 flex items-center gap-2 whitespace-nowrap hover-underline w-fit">Start listing your classifieds now<MoveRight className="hidden xs:block" /></a>
            </div>
            <div>
              <img src="/images/banner/classified_section.png" className="max-w-32 md:max-w-40 lg:max-w-72" />
            </div>
          </div>
        </div>
      </div>
      <Classifieds />
      <Jobs />
    </div>
  )
}



export default MidSection