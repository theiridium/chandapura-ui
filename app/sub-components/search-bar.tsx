"use client"
import { searchText } from "@/lib/atom"
import { SearchPayload } from "@/lib/typings/dto"
import { useAtomValue, useSetAtom } from "jotai"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GetProductFromProductType } from "@/lib/helpers"

const SearchBar = ({ productType }: any) => {
  const setSearchText = useSetAtom(searchText);
  const [payload, setPayload] = useState<SearchPayload>();
  const text = useAtomValue<any>(searchText);
  const router = useRouter();
  const onSearch = async (e: any) => {
    e.preventDefault();
    router.push(`/${GetProductFromProductType(productType)?.url}?index=${payload?.indexUid}&q=${payload?.q}` as string);
  }
  let inputHandler = (e: any) => {
    var text = e.target.value.toLowerCase();
    setSearchText(text);
    setPayload({
      indexUid: GetProductFromProductType(productType)?.searchIndex,
      q: text,
      filter: ""
    })
  }
  
  return (
    <form className="search-container" onSubmit={onSearch}>
      <input className="search-input shrink w-full" placeholder="Start searching..." onChange={inputHandler} value={text} />
      <button className="search-container-btn" type="submit" disabled={text == "" || payload == undefined}>
        <span className="hidden md:block">Search</span><Search className="md:hidden" strokeWidth={3} size={20} />
      </button>
    </form>
  )
}

export default SearchBar