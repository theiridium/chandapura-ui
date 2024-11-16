import { getPublicApiResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import ProductItemsList from "./product-items-list";

const ProductItems = async (props: any) => {
  const attr = props.product.api;
  let isSearchHit = false;
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    res = await getPublicSingleSearchResponse({
      indexUid: props.searchParams.index,
      q: props.searchParams.q
    });
    isSearchHit = true;
  }
  else
    res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3A${attr.sort}&populate=property_details,amenities,featured_image,gallery_images,contact,user`);

  return <ProductItemsList result={res} product={props.product} isSearchHit={isSearchHit} />
}

export default ProductItems