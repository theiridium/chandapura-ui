import { getPublicApiResponse } from "@/lib/apiLibrary";
import ProductDetail from "./product-detail";
import Breadcrumb from "@/app/sub-components/breadcrumb";

const ProductDetailLayout = async ({ id, product }: any) => {
    const { data } = await getPublicApiResponse(`property-listings?populate=featured_image,area,gallery_images,contact,details_by_listingtype.amenities&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            <ProductDetail data={item} product={product} />
        </>
    )
}

export default ProductDetailLayout