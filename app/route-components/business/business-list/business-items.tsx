import { getPublicApiResponse } from "@/lib/apiLibrary";
import BusinessItemsList from "./business-items-list";

const BusinessItems = async (props: any) => {
  const attr = props.product.api;
  let apiUrl = `${attr.base}?sort=updatedAt%3A${attr.sort}&${attr.populate}`
  apiUrl = props.sub_category? `${apiUrl}&filters[sub_category][slug][$eq]=${props.sub_category}`: apiUrl
  const res = await getPublicApiResponse(apiUrl);
  return <BusinessItemsList result={res} product={props.product} />
}

export default BusinessItems