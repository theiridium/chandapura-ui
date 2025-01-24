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
    const attrJobTitles = DropdownList.JobTitles.api;
    let apiUrlLang = `${attrLang.base}?sort=${attrLang.sort}&pagination[pageSize]=100`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}&pagination[pageSize]=100`
    let apiUrlJobTitles = `${attrJobTitles.base}?sort=${attrJobTitles.sort}&pagination[pageSize]=100`
    const resLang = await getPublicApiResponse(apiUrlLang);
    const resArea = await getPublicApiResponse(apiUrlArea);
    const resJobTitles = await getPublicApiResponse(apiUrlJobTitles);
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <JobListingForm resLang={resLang} resArea={resArea} resJobTitles={resJobTitles}>
                    {children}
                </JobListingForm>
            </Suspense>
        </div>
    )
}