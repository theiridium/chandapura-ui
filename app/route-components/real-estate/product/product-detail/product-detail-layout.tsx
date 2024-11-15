import { getPublicApiResponse } from "@/lib/apiLibrary";
import ProductDetail from "./product-detail";
import Breadcrumb from "@/app/sub-components/breadcrumb";

const ProductDetailLayout = async ({ id }: any) => {
    const { data } = await getPublicApiResponse(`real-estates?populate=property_details,amenities,property_images,user&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            <ProductDetail data={item} />
        </>
    )
}

export default ProductDetailLayout