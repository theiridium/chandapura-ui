import { Suspense } from "react"
import ProductDetailLayout from "@/app/route-components/real-estate/product/product-detail/product-detail-layout";
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";

const Page = ({ searchParams }: any) => {
    const id = searchParams.source;
    return (
        <div className="max-w-screen-xl mx-auto px-3 my-5 lg:my-6">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <ProductDetailLayout id={id} />
            </Suspense>
        </div>
    )
}

export default Page