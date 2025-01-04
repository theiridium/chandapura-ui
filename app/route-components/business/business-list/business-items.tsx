import { getPublicApiResponse, getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import BusinessItemsList from "./business-items-list";
import { getSearchResult } from "../actions";

const BusinessItems = async (props: any) => {
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    let search = {searchParams: props.searchParams, page: 1};
    res = await getSearchResult(search);
  }
  return <BusinessItemsList result={res} product={props.product} searchParams={props.searchParams} />
}

export default BusinessItems