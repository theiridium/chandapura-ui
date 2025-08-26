import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading'
import BusinessItems from '@/app/route-components/business/business-list/business-items'
import SearchBar from '@/app/sub-components/search-bar'
import { Products } from '@/public/shared/app.config'
import React, { Suspense } from 'react'

const Page = async (props: any) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  if (!searchParams?.q) {
    searchParams.index = Products.business.searchIndex;
    searchParams.q = "*";
    searchParams.filter = `sub_category.slug=${params.sub_category}`
  }
  return (
    <div className="max-w-screen-xl mx-auto px-3 my-3 lg:my-6">
      <div className="grid lg:grid-cols-4 lg:gap-10 mb-6">
        <div className="col-span-3">
          <SearchBar productType={Products.business.productType} />
        </div>
      </div>
      <Suspense fallback={<GlobalSearchListLoading />}>
        <BusinessItems product={Products.business} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default Page