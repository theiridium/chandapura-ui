import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import { DropdownList } from "@/public/shared/app.config";
import { Suspense } from "react"
import JobListingForm from "./job-listing-form";
export const dynamic = 'force-dynamic'

export default async function JobListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const attrLang = DropdownList.Language.api;
    const attrArea = DropdownList.Area.api;
    let apiUrlLang = `${attrLang.base}?sort=${attrLang.sort}`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}`
    const resLang = await getPublicApiResponse(apiUrlLang);
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <JobListingForm resLang={resLang} resArea={resArea}>
                    {children}
                </JobListingForm>
            </Suspense>
        </div>
    )
}