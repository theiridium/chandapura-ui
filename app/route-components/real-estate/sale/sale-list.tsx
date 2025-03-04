import { Products } from "@/public/shared/app.config";
import SaleCard from "./sale-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import ListArrow from "@/app/sub-components/list-arrow";

const SaleList = async () => {
  const attr = Products.sale.api;
  const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3Adesc&pagination%5Blimit%5D=10&populate=${attr.populateList}&${attr.listingTypeFilter}&${attr.isPublishedFilter}`);
  return (
    <>
      <div className="card-list-row sale-card">
        {res.data.map((property: any, i: any) => (
          property.property_type === "Plot" ? <SaleCard key={i} list={property} id={property.id} apiComponent={Products.plot.api.component} /> :
            <SaleCard key={i} list={property} id={property.id} apiComponent={attr.component} />
        ))}
      </div>
      <ListArrow size={317} row="sale-card" infinite={true} displayArrowLg={res.data.length > 4} />
    </>
  )
}

export default SaleList