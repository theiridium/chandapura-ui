import { Products } from "@/public/shared/app.config";
import RentCard from "./rent-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import ListArrow from "@/app/sub-components/list-arrow";

const RentList = async () => {
  const attr = Products.rent.api;
  const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3Adesc&pagination%5Blimit%5D=10&populate=${attr.populateList}&${attr.listingTypeFilter}&${attr.isPublishedFilter}`);
  return (
    <>
      <div className="card-list-row rent-card">
        {res.data.map((property: any, i: any) => (
          <RentCard key={i} list={property} id={property.id} apiComponent={attr.component} />
        ))}
      </div>
      <ListArrow size={293} row="rent-card" infinite={true} displayArrowLg={res.data.length > 4} />
    </>
  )
}

export default RentList