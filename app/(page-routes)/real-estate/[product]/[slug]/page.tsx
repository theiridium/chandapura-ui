import { Suspense } from "react"
import ProductDetailLayout from "@/app/route-components/real-estate/product/product-detail/product-detail-layout";
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";
import AdLoading from "@/app/loading-components/ad-loading";
import AdBanner from "@/app/sub-components/ad-banner";
import { GetProductFromParam, IsProductUrl } from "@/lib/helpers";
import { notFound } from "next/navigation";

const Page = async (
    props: { params: Promise<{ product: string }>, searchParams: Promise<any> }
) => {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const id = searchParams.source;
    if (!IsProductUrl(params.product)) notFound();
    const product: any = GetProductFromParam(params.product);
    return (
        <div className="max-w-screen-xl mx-auto lg:px-3 lg:my-6">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <ProductDetailLayout id={id} product={product} />
            </Suspense>
            <div className="col-span-1 lg:col-span-full my-10">
                <Suspense fallback={<AdLoading />}>
                    <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
                </Suspense>
            </div>
        </div>
    )
}

export default Page