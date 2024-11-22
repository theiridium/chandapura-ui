import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import { Suspense } from "react";
import AdListingForm from "./ad-listing-form";
export const dynamic = 'force-dynamic'

export default async function BusinessListingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="max-w-screen-xl mx-auto">
            <Suspense fallback={<GlobalSearchListLoading />}>
                <AdListingForm>
                    {children}
                </AdListingForm>
            </Suspense>
        </div>
    )
}