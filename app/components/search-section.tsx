"use client"

import { ProductSelect, Products } from "@/public/shared/app.config"
import { Tab, Tabs } from "@nextui-org/react"
import SearchBar from "../sub-components/search-bar"
import { useEffect, useState } from "react"
import { useSetAtom } from "jotai"
import { categories, classifiedCategories, searchText } from "@/lib/atom"
import SearchCategorySection from "../sub-components/search-category-section"
import { getPublicApiResponse } from "@/lib/apiLibrary"

const SearchSection = () => {
  const [productType, setProductType] = useState<any>(ProductSelect[0].value);
  const setSearchText = useSetAtom(searchText);
  const clearSearchBox = () => setSearchText("");
  const setBizCategories = useSetAtom(categories);
  const setClassifiedCategories = useSetAtom(classifiedCategories);
  useEffect(() => {
    clearSearchBox();
  }, [])
  const getAllCategoriesList = async () => {
    const [bizCategoriesResponse, classifiedCategoriesResponse] = await Promise.all([
      getPublicApiResponse(`categories?populate=image&sort=name&pagination[limit]=100`),
      getPublicApiResponse(`classified-categories?populate=image&sort=name&pagination[limit]=100`)
    ]);
    console.log(bizCategoriesResponse.data)
    setBizCategories(bizCategoriesResponse.data);
    setClassifiedCategories(classifiedCategoriesResponse.data);
  }
  useEffect(() => {
    getAllCategoriesList();
  }, [])

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:mt-10 relative gap-5 lg:gap-10">
          <div className="col-span-1 lg:col-start-3 lg:col-span-8">
            <Tabs color="secondary" aria-label="Tabs colors" radius="full"
              classNames={{
                base: "mb-5 flex justify-center",
                tabList: "bg-color2d/30 p-2 gap-0 w-full md:w-auto",
                tab: "*:font-medium text-xs md:text-base px-2 md:px-5 md:py-5 data-[hover-unselected=true]:opacity-100 data-[hover-unselected=true]:bg-color2d/50 *:!text-secondary-foreground"
              }}
              selectedKey={productType}
              onSelectionChange={setProductType}>
              {ProductSelect.map((x) => (
                <Tab key={x.value} title={x.label} />
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      {/* <div className="max-w-screen-xl mx-auto px-3 sticky md:static top-5 md:top-0 z-30 mb-5 md:mb-10"> */}
      <div className="max-w-screen-xl mx-auto px-3 mb-5 md:mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 relative gap-5 lg:gap-10">
          <div className="col-span-1 lg:col-start-3 lg:col-span-8">
            <div className="flex items-center">
              <SearchBar productType={productType} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-3 mb-12 md:mb-20">
        <div className="col-span-1 lg:col-span-12">
          <SearchCategorySection productType={productType} />
        </div>
      </div>
    </>
  )
}

export default SearchSection