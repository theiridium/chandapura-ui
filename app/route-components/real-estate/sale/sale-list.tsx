import ListArrow from "../../business/list-arrow";
import SaleCard from "./sale-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";

const SaleList = async () => {
  const res = await getPublicApiResponse("real-estates?sort=updatedAt%3Adesc&pagination%5Blimit%5D=4&filters[listing_type][$eq]=Sale&populate=property_images%2C%20user");
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