import { GetProductFromParam, IsProductUrl } from "@/lib/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";
import SearchBar from "@/app/sub-components/search-bar";
import ProductItems from "@/app/route-components/real-estate/product/product-list/product-items";

const Page = ({ params }: { params: { product: string } }) => {
    if (!IsProductUrl(params.product)) notFound();
    const product = GetProductFromParam(params.product);
    return (
        <div className="max-w-screen-xl mx-auto px-3 mt-3 lg:my-6">
            <div className="grid lg:grid-cols-4 lg:gap-10 mb-4">
                <div className="col-span-3">
                    {product && <SearchBar productType={product?.productType} />}
                </div>
            </div>
            <Suspense fallback={<GlobalSearchListLoading />}>
                <ProductItems product={product} />
            </Suspense>
        </div>
    )
}

export default Page