import AdLoading from "@/app/loading-components/ad-loading"
import GlobalSearchListLoading from "@/app/loading-components/global-search-list-loading"
import Categories from "@/app/route-components/categories/categories"
import AdBanner from "@/app/sub-components/ad-banner"
import { Suspense } from "react"

const Page = ({ params }: any) => {
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="grid mt-3 mb-10 lg:my-10 relative gap-5 lg:gap-14">
          <div className="order-first mb-8 lg:mb-0">
            <Suspense fallback={<AdLoading />}>
              <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
            </Suspense>
          </div>
          <div className="">
            <Suspense fallback={<GlobalSearchListLoading />}>
              <Categories slug={params.category} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page