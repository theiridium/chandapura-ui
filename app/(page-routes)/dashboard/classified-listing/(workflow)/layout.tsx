import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import { DropdownList } from "@/public/shared/app.config";
import { Suspense } from "react"
import ClassifiedListingForm from "./classified-listing-form";
export const dynamic = 'force-dynamic'

export default async function ClassifiedListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const attrCat = DropdownList.ClassifiedCategory.api;
    const attrArea = DropdownList.Area.api;
    let apiUrlCat = `${attrCat.base}?sort=${attrCat.sort}&populate=${attrCat.populate}&pagination[pageSize]=100`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}&pagination[pageSize]=100`
    const resCat = await getPublicApiResponse(apiUrlCat);
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <Suspense fallback={<GlobalSearchListLoading />}>
            <ClassifiedListingForm resCat={resCat} resArea={resArea}>
                {children}
            </ClassifiedListingForm>
        </Suspense>
    )
}