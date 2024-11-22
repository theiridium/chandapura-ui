import { getPublicApiResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import ProductItemsList from "./product-items-list";

const ProductItems = async (props: any) => {
  const attr = props.product.api;
  let isSearchHit = false;
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    let searchFilter = props.product.productType !== "real-estate"? `listing_type = ${props.product.label}`: ""
    res = await getPublicSingleSearchResponse({
      indexUid: props.searchParams.index,
      q: props.searchParams.q,
      filter: searchFilter
    });
    isSearchHit = true;
  }
  else
    res = await getPublicApiResponse(`${attr.base}?sort=updatedAt%3A${attr.sort}&populate=${attr.populateList}&${attr.isPublishedFilter}&${attr.listingTypeFilter}`);

  return <ProductItemsList result={res} product={props.product} isSearchHit={isSearchHit} />
}

export default ProductItems