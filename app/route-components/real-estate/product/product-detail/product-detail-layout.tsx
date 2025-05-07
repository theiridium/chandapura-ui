import { getPublicApiResponse } from "@/lib/apiLibrary";
import ProductDetail from "./product-detail";
import Breadcrumb from "@/app/sub-components/breadcrumb";
import { Products } from "@/public/shared/app.config";
import { notFound } from "next/navigation";

const ProductDetailLayout = async ({ id, product }: any) => {
    const attr = Products.realEstate.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}&filters[publish_status]=true`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            {!item ? notFound() : <ProductDetail data={item} product={product} />}
        </>
    )
}

export default ProductDetailLayout