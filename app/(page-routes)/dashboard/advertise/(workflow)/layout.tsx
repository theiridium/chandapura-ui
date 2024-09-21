import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import { DropdownList } from "@/public/shared/app.config";
import { Suspense } from "react";
import AdListingForm from "./ad-listing-form";

export default async function BusinessListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const attrCat = DropdownList.Category.api;
    const attrLocation = DropdownList.Location.api;
    let apiUrlCat = `${attrCat.base}?sort=${attrCat.sort}&populate=${attrCat.populate}`
    let apiUrlLocation = `${attrLocation.base}?sort=${attrLocation.sort}`
    const resCat = await getPublicApiResponse(apiUrlCat);
    const resLocation = await getPublicApiResponse(apiUrlLocation);
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <AdListingForm resCat={resCat} resLocation={resLocation}>
                    {children}
                </AdListingForm>
            </Suspense>
        </div>
    )
}