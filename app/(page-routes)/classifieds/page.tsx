import AdLoading from '@/app/loading-components/ad-loading'
import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading'
import ClassifiedItems from '@/app/route-components/classifieds/classified-list/classified-items'
import AdBanner from '@/app/sub-components/ad-banner'
import SearchBar from '@/app/sub-components/search-bar'
import { Products } from '@/public/shared/app.config'
import React, { Suspense } from 'react'
export const dynamic = 'force-dynamic'

const Page = ({ searchParams }: any) => {
  return (
    <div className="max-w-screen-xl mx-auto px-3 mt-3 lg:my-6">
      <div className="grid lg:grid-cols-4 lg:gap-10 mb-6">
        <div className="col-span-3">
          <SearchBar productType={Products.classifieds.productType} />
        </div>
      </div>
      <div className="col-span-1 lg:col-span-full">
        <Suspense fallback={<AdLoading />}>
          <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
        </Suspense>
      </div>
      <Suspense fallback={<GlobalSearchListLoading />}>
        <ClassifiedItems product={Products.classifieds} category={null} searchParams={searchParams}  />
      </Suspense>
    </div>
  )
}

export default Page