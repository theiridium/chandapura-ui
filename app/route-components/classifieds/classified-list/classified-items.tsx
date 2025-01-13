import ClassifiedItemsList from "./classified-items-list";
import { getSearchResult } from "@/app/actions";

const ClassifiedItems = async (props: any) => {
  let searchFilter = props.category && `category.slug = ${props.category}`
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    props.searchParams.filter = searchFilter;
    props.searchParams.noExpFilter = true;
    let search = { searchParams: props.searchParams, page: 1 };
    res = await getSearchResult(search);
  }
  return <ClassifiedItemsList result={res} product={props.product} />
}

export default ClassifiedItems