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
    const attrRealEstateAmenities = DropdownList.RealEstateAmenities.api;
    const attrPgAmenities = DropdownList.PGAmenities.api;
    const attrArea = DropdownList.Area.api;
    let apiUrlRealEstateAmenities = `${attrRealEstateAmenities.base}?sort=${attrRealEstateAmenities.sort}`
    let apiUrlPgAmenities = `${attrPgAmenities.base}?sort=${attrPgAmenities.sort}`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}`
    const resRealEstateAmenities = await getPublicApiResponse(apiUrlRealEstateAmenities);
    const resPgAmenities = await getPublicApiResponse(apiUrlPgAmenities);
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <PropertyListingForm resRealEstateAmenities={resRealEstateAmenities} resPgAmenities={resPgAmenities} resArea={resArea}>
                    {children}
                </PropertyListingForm>
            </Suspense>
        </div>
    )
}