"use client"

import { ProductSelect, Products } from "@/public/shared/app.config"
import { Tab, Tabs } from "@nextui-org/react"
import SearchBar from "../sub-components/search-bar"
import { useEffect, useState } from "react"
import { useSetAtom } from "jotai"
import { searchText } from "@/lib/atom"
import SearchCategorySection from "../sub-components/search-category-section"

const SearchSection = () => {
  const [productType, setProductType] = useState<any>(ProductSelect[0].value);
  const setSearchText = useSetAtom(searchText);
  const clearSearchBox = () => setSearchText("");
  useEffect(() => {
    clearSearchBox();
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:mt-10 relative gap-5 lg:gap-10">
      <div className="col-span-1 lg:col-start-3 lg:col-span-8">
        <Tabs color="secondary" aria-label="Tabs colors" radius="full"
          classNames={{
            base: "mb-5 flex justify-center",
            tabList: "bg-color2d/30 p-2 gap-0",
            tab: "border border-transparent text-xs md:text-sm md:text-base px-2 md:px-3 data-[hover-unselected=true]:opacity-100 data-[hover-unselected=true]:border-color2d"
          }}
          selectedKey={productType}
          onSelectionChange={setProductType}>
          {ProductSelect.map((x) => (
            <Tab key={x.value} title={x.label} />
          ))}
        </Tabs>
        <div className="relative flex items-center">
          <SearchBar productType={productType} />
        </div>
      </div>
      {(productType === Products.business.productType || productType === Products.sale.productType) &&
        <div className="col-span-1 lg:col-span-12">
          <SearchCategorySection productType={productType} />
        </div>
      }
    </div>
  )
}

export default SearchSection