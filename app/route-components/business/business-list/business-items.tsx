import { getSearchResult } from "@/app/actions";
import BusinessItemsList from "./business-items-list";

const BusinessItems = async (props: any) => {
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    props.searchParams.noExpFilter = true;
    let search = {searchParams: props.searchParams, page: 1};
    res = await getSearchResult(search);
  }
  return <BusinessItemsList result={res} product={props.product} searchParams={props.searchParams} />
}

export default BusinessItems