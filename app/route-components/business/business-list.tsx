import { Products } from "@/public/shared/app.config";
import BusinessCard from "./business-card";
import { getPublicApiResponse } from "@/lib/apiLibrary";
import ListArrow from "@/app/sub-components/list-arrow";

const BusinessList = async () => {
  const attr = Products.business.api;
  // const businessList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&${attr.populate}&pagination%5Blimit%5D=15`);
  const businessList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&populate=${attr.populateList}`);
  return (
    <>
      <div className="business-card-list-row">
        {businessList.data.map((bus: any, i: any) => (
          <BusinessCard key={i} list={bus} id={bus.id} />
        ))}
      </div>
      <ListArrow size={424} row="business-card-list-row" infinite={true} displayArrowLg={businessList.data.length > 3} />
    </>
  )
}

export default BusinessList