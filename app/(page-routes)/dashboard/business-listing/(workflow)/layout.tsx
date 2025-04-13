import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { getPublicApiResponse } from "@/lib/apiLibrary";
import { DropdownList } from "@/public/shared/app.config";
import { Suspense } from "react"
import BusinessListingForm from "./business-listing-form";
export const dynamic = 'force-dynamic'

export default async function BusinessListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // const attrCat = DropdownList.Category.api;
    const attrSubCat = DropdownList.SubCategory.api;
    const attrArea = DropdownList.Area.api;
    // let apiUrlCat = `${attrCat.base}?sort=${attrCat.sort}&populate=${attrCat.populate}&pagination[pageSize]=100`
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}&pagination[pageSize]=100`;
    // const resCat = await getPublicApiResponse(apiUrlCat);
    const resArea = await getPublicApiResponse(apiUrlArea);
    const fetchSubCatData: any = async (pageNum: number, collectedData: any[] = []) => {
        try {
            const apiUrlSubCat = `${attrSubCat.base}?sort=${attrSubCat.sort}&populate=${attrSubCat.populate}&pagination[page]=${pageNum}&pagination[pageSize]=100`;
            const res = await getPublicApiResponse(apiUrlSubCat);

            if (res?.data) collectedData.push(...res.data);

            if (res?.meta?.pagination.page < res?.meta?.pagination.pageCount) {
                return fetchSubCatData(res.meta.pagination.page + 1, collectedData);
            }
            return collectedData;
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            return [];
        }
    };
    const subCatList = await fetchSubCatData(1);
    return (
        <Suspense fallback={<GlobalSearchListLoading />}>
            <BusinessListingForm resArea={resArea} subCatList={subCatList}>
                {children}
            </BusinessListingForm>
        </Suspense>
    )
}