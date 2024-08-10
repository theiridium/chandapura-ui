"use client"
import { searchResult, searchText } from "@/lib/atom"
import { SearchPayload } from "@/lib/typings/dto"
import { getPublicSingleSearchResponse } from "@/lib/apiLibrary"
import { useAtomValue, useSetAtom } from "jotai"
import { Search } from "lucide-react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { GetProductFromProductType } from "@/lib/helpers"

const SearchBar = ({ productType }: any) => {
  const setSearchResult = useSetAtom(searchResult);
  const setSearchText = useSetAtom(searchText);
  const [payload, setPayload] = useState<SearchPayload>();
  const text = useAtomValue<any>(searchText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const path = usePathname();
  const router = useRouter();
  const onSearch = async () => {
    setIsLoading(true);
    const res = await getPublicSingleSearchResponse(payload);
    setSearchResult(res);
    setIsLoading(false);
    if (path === "/") router.push(GetProductFromProductType(productType)?.url as string)
  }
  let inputHandler = (e: any) => {
    var text = e.target.value.toLowerCase();
    setSearchText(text);
    setPayload({
      indexUid: productType,
      q: text
    })
  }
  return (
    <div className="search-container">
      <input className="search-input shrink w-full" placeholder="Start searching..." onChange={inputHandler} value={text} />
      <button className="search-container-btn" onClick={onSearch} disabled={isLoading}>
        Search
      </button>
      <button className="search-container-icon" onClick={onSearch} disabled={isLoading}>
        <Search strokeWidth={3} size={20} />
      </button>
    </div>
  )
}

export default SearchBar