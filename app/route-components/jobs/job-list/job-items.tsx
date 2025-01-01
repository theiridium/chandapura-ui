import { getPublicApiResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import JobItemsList from "./job-items-list";

const JobItems = async (props: any) => {
  const attr = props.product.api;
  let isSearchHit = false;
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    res = await getPublicSingleSearchResponse({
      indexUid: props.searchParams.index,
      q: props.searchParams.q,
      filter: "",
      searchFacets: props.product.searchFacets,
      noExpFilter: true
    });
    isSearchHit = true;
  }
  else {
    let apiUrl = `${attr.base}?sort=publishedAt%3A${attr.sort}&populate=${attr.populateList}&${attr.isPublishedFilter}`
    // apiUrl = props.category ? `${apiUrl}&filters[category][slug][$eq]=${props.category}` : apiUrl
    res = await getPublicApiResponse(apiUrl);
  }
  return <JobItemsList result={res} product={props.product} isSearchHit={isSearchHit} />
}

export default JobItems