import AdLoading from '@/app/loading-components/ad-loading'
import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading'
import BusinessItems from '@/app/route-components/business/business-list/business-items'
import AdBanner from '@/app/sub-components/ad-banner'
import SearchBar from '@/app/sub-components/search-bar'
import { Products } from '@/public/shared/app.config'
import React, { Suspense } from 'react'
export const dynamic = 'force-dynamic'

const Page = ({ searchParams }: any) => {
  if (!searchParams?.q) {
    searchParams.index = Products.business.searchIndex;
    searchParams.q = "*";
  }
  return (
    <>
      <div className="max-w-screen-2xl mx-auto mb-10">
        <Suspense fallback={<AdLoading />}>
          <AdBanner placement="grid grid-cols-1 gap-x-10 mb-5" />
        </Suspense>
      </div>
      <div className="max-w-screen-xl mx-auto px-3 mt-3 lg:mt-6">
        <div className="grid lg:grid-cols-4 lg:gap-10 mb-6">
          <div className="col-span-3">
            <SearchBar productType={Products.business.productType} />
          </div>
        </div>
        <Suspense fallback={<GlobalSearchListLoading />}>
          <BusinessItems product={Products.business} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  )
}

export default Page