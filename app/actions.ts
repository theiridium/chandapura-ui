'use server'

import { getPublicSingleSearchResponse } from "@/lib/apiLibrary";

export async function getSearchResult({ searchParams, page = 1 }: { searchParams: any, page: number }) {
    let sort: any = [];
    if (searchParams.q === "*") sort.push("updatedAt:desc");
    const result = await getPublicSingleSearchResponse({
        indexUid: searchParams.index,
        q: searchParams.q,
        filter: searchParams?.filter,
        noExpFilter: searchParams?.noExpFilter,
        sort: sort,
        page: page,
        hitsPerPage: 10,
    });
    return result;
}