import { Products } from "@/public/shared/app.config";
import BusinessCard from "./business-card";
import ListArrow from "./list-arrow";
import { getPublicApiResponse } from "@/lib/apiLibrary";

const BusinessList = async () => {
  const attr = Products.business.api;
  const businessList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&${attr.populate}&pagination%5Blimit%5D=15`);
  return (
    <>
      <div className="business-card-list-row">
        {businessList.data.map((bus: any, i: any) => (
          <BusinessCard key={i} list={bus} id={bus.id} />
        ))}
      </div>
      <ListArrow size={400} row="business-card-list-row" infinite={true} />
    </>
  )
}

export default BusinessList