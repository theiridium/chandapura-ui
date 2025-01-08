"use client"
import { searchText } from "@/lib/atom"
import { SearchPayload } from "@/lib/typings/dto"
import { useAtomValue, useSetAtom } from "jotai"
import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GetProductFromProductType } from "@/lib/helpers"
import { useDebounce } from "@uidotdev/usehooks"
import { getPublicSingleSearchResponse } from "@/lib/apiLibrary"
import { Products } from "@/public/shared/app.config"

const SearchBar = ({ productType }: any) => {
  const setSearchText = useSetAtom(searchText);
  const [payload, setPayload] = useState<SearchPayload>();
  const text = useAtomValue<any>(searchText);
  const debouncedSearchTerm = useDebounce(text, 300);
  const [suggest, setSuggest] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const onSearch = async (e: any) => {
    e.preventDefault();
    router.push(`/${GetProductFromProductType(productType)?.url}?index=${encodeURIComponent(payload?.indexUid as string)}&q=${encodeURIComponent(payload?.q)}` as string);
  }
  let inputHandler = (e: any) => {
    var text = e.target.value.toLowerCase();
    setSearchText(text);
    setPayload({
      indexUid: GetProductFromProductType(productType)?.searchIndex,
      q: text,
      filter: "",
      searchFacets: GetProductFromProductType(productType)?.searchFacets,
      page: 1,
      hitsPerPage: Number(GetProductFromProductType(productType)?.searchPageLimit),
    })
  }

  const onSuggestClick = (name: string) => {
    setSearchText(name);
    const suggestSearchPayload: SearchPayload = {
      indexUid: GetProductFromProductType(productType)?.searchIndex,
      q: name,
      page: 1,
      hitsPerPage: Number(GetProductFromProductType(productType)?.searchPageLimit),
    };
    router.push(`/${GetProductFromProductType(productType)?.url}?index=${encodeURIComponent(suggestSearchPayload?.indexUid)}&q=${encodeURIComponent(suggestSearchPayload?.q)}` as string);
  }

  useEffect(() => {
    const getSuggestions = async () => {
      let results = [];
      // setIsSearching(true);
      if (debouncedSearchTerm) {
        const data = await getPublicSingleSearchResponse({
          indexUid: GetProductFromProductType(productType)?.searchSuggestIndex,
          q: debouncedSearchTerm
        });
        results = data.results[0]?.hits || [];
      }

      // setIsSearching(false);
      setSuggest(results);
    }
    getSuggestions();
  }, [debouncedSearchTerm])

  useEffect(() => {
    setSearchText("")
  }, [productType])



  return (
    <form className="search-container" onSubmit={onSearch}>
      <div className="search-input" role="combobox" aria-haspopup="listbox" >
        <input className="w-full" aria-controls="suggest-box" placeholder="Start searching..." onChange={inputHandler} value={text} onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)} />
        {isFocused && suggest.length > 0 && <div id="suggest-box" role="listbox" className="search-list">
          {suggest.map((x: any, i: any) =>
            <div onClick={() => onSuggestClick(x.name)} className="py-3 px-5 hover:bg-default-100 rounded-md cursor-pointer flex items-start gap-x-3 font-semibold" key={i}>
              <Search className="mt-1" size={20} />
              <div>
                <div>{x.name}</div>
                <div className="text-sm font-light">
                  {GetProductFromProductType(productType)?.productType === Products.realEstate.productType ? 'Location' :
                    (GetProductFromProductType(productType)?.productType === Products.job.productType ? 'Job Title' :
                      'Category')}</div>
              </div>
            </div>
          )}
        </div>}
      </div>
      {!!text && <button type="button" className="bg-default-100 w-10 aspect-square text-center rounded-full hover:bg-default-200" onClick={() => setSearchText("")}><X className="m-auto" size={18} strokeWidth={2} /></button>}
      <button className="search-container-btn" type="submit" disabled={text == "" || payload == undefined}>
        <span className="hidden md:block">Search</span><Search className="md:hidden" strokeWidth={3} size={20} />
      </button>
    </form>
  )
}

export default SearchBar