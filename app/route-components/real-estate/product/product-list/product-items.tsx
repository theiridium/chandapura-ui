import ProductItemsList from "./product-items-list";
import { getSearchResult } from "@/app/actions";

const ProductItems = async (props: any) => {
  let searchFilter = props.product.productType !== "real-estate" ? `listing_type = ${props.product.label}` : ""
  let res = null;
  if (props.searchParams && props.searchParams.q) {
    props.searchParams.filter = searchFilter;
    props.searchParams.noExpFilter = true; //free listing
    let search = { searchParams: props.searchParams, page: 1 };
    res = await getSearchResult(search);
  }

  return <ProductItemsList result={res} product={props.product} searchParams={props.searchParams} />
}

export default ProductItems