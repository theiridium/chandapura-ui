import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";
import BusinessDetailLayout from "@/app/route-components/business/business-detail/business-detail-layout";
import { Suspense } from "react";

const Page = ({ params }: any) => {
    const urlParams = new URLSearchParams(decodeURIComponent(params.slug));
    const id = urlParams.get('id');
    return (
        <div className="max-w-screen-xl mx-auto px-3 my-5 lg:my-6">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <BusinessDetailLayout id={id} />
            </Suspense>
        </div>
    )
}

export default Page