import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import { DropdownList } from "@/public/shared/app.config";
import { Suspense } from "react"
import PropertyListingForm from "./property-listing-form";
export const dynamic = 'force-dynamic'

export default async function BusinessListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const attrAmenities = DropdownList.Amenities.api;
    const attrArea = DropdownList.Area.api;
    let apiUrlAmenities = `${attrAmenities.base}?sort=${attrAmenities.sort}`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}`
    const resAmenities = await getPublicApiResponse(apiUrlAmenities);
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <PropertyListingForm resAmenities={resAmenities} resArea={resArea}>
                    {children}
                </PropertyListingForm>
            </Suspense>
        </div>
    )
}