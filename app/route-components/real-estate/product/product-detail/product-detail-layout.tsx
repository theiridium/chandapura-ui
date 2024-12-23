import { getPublicApiResponse } from "@/lib/apiLibrary";
import ProductDetail from "./product-detail";
import Breadcrumb from "@/app/sub-components/breadcrumb";
import { Products } from "@/public/shared/app.config";

const ProductDetailLayout = async ({ id, product }: any) => {
    const attr = Products.realEstate.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            <ProductDetail data={item} product={product} />
        </>
    )
}

export default ProductDetailLayout