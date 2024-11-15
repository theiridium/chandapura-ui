import ListArrow from "../../business/list-arrow";
import RentCard from "./rent-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";

const RentList = async () => {
  const propertyList = await getPublicApiResponse("real-estates?sort=updatedAt%3Adesc&pagination%5Blimit%5D=4&populate=property_details,property_images,user&filters[property_details][listing_type][$eq]=Rent");
  return (
    <>
      <div className="card-list-row">
        {propertyList.data.map((property: any, i: any) => (
          <RentCard key={i} list={property} id={property.id} />
        ))}
      </div>
      <ListArrow size={293} row="card-list-row" />
    </>
  )
}

export default RentList