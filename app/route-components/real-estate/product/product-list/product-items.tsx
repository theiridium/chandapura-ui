import { getPublicApiResponse } from "@/lib/apiLibrary";
import ProductItemsList from "./product-items-list";

const ProductItems = async (props: any) => {
  const attr = props.product.api;
  const res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3A${attr.sort}&populate=property_images,user,real_estate_amenities`);

  return <ProductItemsList result={res} product={props.product} />
}

export default ProductItems