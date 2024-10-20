import Classifieds from "./classifieds/classifieds"
import Rent from "../route-components/real-estate/rent/rent"
import Sale from "../route-components/real-estate/sale/sale"
import Business from "../route-components/business/business"


const MidSection = () => {
  return (
    <div className="pb-10">
      <div id="section-1">
        <Business />
      </div>
      <Rent />
      <Sale />
      {/* <Classifieds /> */}
      {/* <Job /> */}
    </div>
  )
}



export default MidSection