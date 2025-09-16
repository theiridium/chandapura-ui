import { GetProductFromParam, IsProductUrl } from "@/lib/helpers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";
import SearchBar from "@/app/sub-components/search-bar";
import ProductItems from "@/app/route-components/real-estate/product/product-list/product-items";
import AdLoading from "@/app/loading-components/ad-loading";
import AdBanner from "@/app/sub-components/ad-banner";

const Page = async (
    props: { params: Promise<{ product: string }>, searchParams: Promise<any> }
) => {
    const searchParams = await props.searchParams;
    const params = await props.params;
    if (!IsProductUrl(params.product)) notFound();
    const product: any = GetProductFromParam(params.product);
    if (!searchParams?.q) {
        searchParams.index = product.searchIndex;
        searchParams.q = "*";
    }
    return (
        <>
            <div className="max-w-screen-2xl mx-auto mb-10">
                <Suspense fallback={<AdLoading />}>
                    <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
                </Suspense>
            </div>
            <div className="max-w-screen-xl mx-auto px-3 my-3 lg:my-6">
                <div className="grid lg:grid-cols-4 lg:gap-10 mb-6">
                    <div className="col-span-3">
                        {product && <SearchBar productType={product?.productType} />}
                    </div>
                </div>
                <Suspense fallback={<GlobalSearchListLoading />}>
                    <ProductItems product={product} searchParams={searchParams} />
                </Suspense>
            </div>
        </>
    )
}

export default Page