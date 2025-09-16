import AdLoading from "@/app/loading-components/ad-loading"
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import Categories from "@/app/route-components/categories/categories"
import AdBanner from "@/app/sub-components/ad-banner"
import { Suspense } from "react"

const Page = async (props: any) => {
  const params = await props.params;
  return (
    <>
        <div className="grid relative">
          <div className="max-w-screen-2xl mx-auto order-first mb-10">
            <Suspense fallback={<AdLoading />}>
              <AdBanner placement="grid grid-cols-1 gap-x-10" />
            </Suspense>
          </div>
          <div className="max-w-screen-xl mb-10 mx-auto px-3 w-full">
            <Suspense fallback={<GlobalSearchListLoading />}>
              <Categories slug={params.category} />
            </Suspense>
          </div>
        </div>
    </>
  )
}

export default Page