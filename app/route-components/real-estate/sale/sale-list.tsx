import ListArrow from "../../business/list-arrow";
import SaleCard from "./sale-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";

const SaleList = async () => {
  const res = await getPublicApiResponse("real-estates?sort=updatedAt%3Adesc&pagination%5Blimit%5D=4&populate=property_details,featured_image,contact,area&filters[listing_type][$eq]=Sale&filters[publish_status][$eq]=true");
  return (
    <>
      <div className="card-list-row">
        {res.data.map((property: any, i: any) => (
          <SaleCard key={i} list={property} id={property.id} />
        ))}
      </div>
      <ListArrow size={293} row="card-list-row" />
    </>
  )
}

export default SaleList