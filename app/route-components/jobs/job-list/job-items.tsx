import JobItemsList from "./job-items-list";
import { getSearchResult } from "@/app/actions";

const JobItems = async (props: any) => {
  let searchFilter = props.category && `category = ${props.category}`
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    props.searchParams.filter = searchFilter;
    props.searchParams.noExpFilter = true;
    let search = { searchParams: props.searchParams, page: 1 };
    res = await getSearchResult(search);
  }
  return <JobItemsList result={res} product={props.product} />
}

export default JobItems