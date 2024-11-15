import AdLoading from "@/app/loading-components/ad-loading";
import FormLoading from "@/app/loading-components/form-loading";
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading";
import BusinessDetailLayout from "@/app/route-components/business/business-detail/business-detail-layout";
import AdBanner from "@/app/sub-components/ad-banner";
import { Suspense } from "react";

const Page = ({ searchParams }: any) => {
    const id = searchParams.source;
    return (
        <div className="max-w-screen-xl mx-auto lg:px-3 lg:my-6">
            <Suspense fallback={<div className="h-screen"><FormLoading text={"Loading..."} /></div>}>
                <BusinessDetailLayout id={id} />
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