import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading'
import ClassifiedItems from '@/app/route-components/classifieds/classified-list/classified-items'
import SearchBar from '@/app/sub-components/search-bar'
import { Products } from '@/public/shared/app.config'
import React, { Suspense } from 'react'

const Page = ({params, searchParams}: any) => {
  if (!searchParams?.q) {
    searchParams.index = Products.classifieds.searchIndex;
    searchParams.q = "*";
  }
  return (
    <div className="max-w-screen-xl mx-auto px-3 mt-3 lg:my-6">
      <div className="grid lg:grid-cols-4 lg:gap-10 mb-6">
        <div className="col-span-3">
          <SearchBar productType={Products.classifieds.productType} />
        </div>
      </div>
      <Suspense fallback={<GlobalSearchListLoading />}>
        <ClassifiedItems product={Products.classifieds} category={params.category} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default Page