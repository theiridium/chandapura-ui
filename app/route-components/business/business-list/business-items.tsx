import { getPublicApiResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import BusinessItemsList from "./business-items-list";

const BusinessItems = async (props: any) => {
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
  else {
    let apiUrl = `${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.populate}&${attr.isPublishedFilter}`
    apiUrl = props.sub_category ? `${apiUrl}&filters[sub_category][slug][$eq]=${props.sub_category}` : apiUrl
    res = await getPublicApiResponse(apiUrl);
  }
  return <BusinessItemsList result={res} product={props.product} isSearchHit={isSearchHit} />
}

export default BusinessItems