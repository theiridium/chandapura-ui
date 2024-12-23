import { Products } from "@/public/shared/app.config";
import ListArrow from "../../business/list-arrow";
import RentCard from "./rent-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";

const RentList = async () => {
  const attr = Products.rent.api;
  const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3Adesc&pagination%5Blimit%5D=4&populate=${attr.populateList}&${attr.listingTypeFilter}&${attr.isPublishedFilter}`);
  return (
    <>
      <div className="card-list-row">
        {res.data.map((property: any, i: any) => (
          <RentCard key={i} list={property} id={property.id} apiComponent={attr.component} />
        ))}
      </div>
      <ListArrow size={293} row="card-list-row" />
    </>
  )
}

export default RentList