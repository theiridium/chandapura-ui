"use client"
import React, { useEffect, useState } from 'react'
import ProductItemsCard from './product-items-card'
import { useAtomValue } from 'jotai';
import { searchResult } from '@/lib/atom';
import { isEmptyObject } from '@/lib/helpers';

const ProductItemsList = (props: any) => {
    const [isSearchHit, setIsSearchHit] = useState<boolean>(false);
    const search = useAtomValue<any>(searchResult);
    const [propertyData, setPropertyData] = useState<any>(props.result.data);
    const [searchedData, setSearchedData] = useState<any>();
    useEffect(() => {
        if (!isEmptyObject(search)) {
            setIsSearchHit(true);
            setSearchedData(search.results[0]);
            setPropertyData(search.results[0].hits);
        }
    }, [search])
    return (
        <>
            {!isSearchHit && <h2 className="text-lg mb-4 mx-2 lg:mx-auto lg:mb-4">{props.result.meta.pagination.total} {props.result.meta.pagination.total === 1 ? 'result' : 'results'} from your search</h2>}
            {isSearchHit && <h2 className="text-lg mb-4 mx-2 lg:mx-auto lg:mb-4">{searchedData.estimatedTotalHits} {searchedData.estimatedTotalHits === 1 ? 'result' : 'results'} from your search</h2>}
            <div className="grid lg:grid-cols-4 lg:gap-10">
                <div className="col-span-3">
                    <div className="grid grid-cols-1 gap-4 lg:gap-8 mb-4 lg:mb-10">
                        {propertyData.map((data: any, i: any) => (
                            <ProductItemsCard key={i} data={data} id={data.id} product={props.product} />
                        ))}
                    </div>
                </div>
                <div></div>
            </div>
        </>
    )
}

export default ProductItemsList