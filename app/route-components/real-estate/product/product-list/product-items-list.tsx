"use client"
import React, { useEffect, useState } from 'react'
import ProductItemsCard from './product-items-card'
import Breadcrumb from '@/app/sub-components/breadcrumb'
import PgItemsCard from './pg-items-card'
import { useInView } from 'react-intersection-observer'
import { getSearchResult } from '@/app/actions'
import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading'
import { CloudImages, Products, Resource } from '@/public/shared/app.config'
import ZeroListingCard from '@/app/components/cards/zero-listing-card'

const ProductItemsList = (props: any) => {
    const searchedData = props.result.results[0];
    const [list, setList] = useState(props.result.results[0].hits);
    const [totalPages, setTotalPages] = useState(props.result.results[0].totalPages);
    const [page, setPage] = useState(1);
    const [displayLoader, setDisplayLoader] = useState(true);
    const { ref, inView, entry } = useInView({
        threshold: 0,
    });
    const loadMore = async () => {
        const next = page + 1;
        let search = { searchParams: props.searchParams, page: next };
        const res = await getSearchResult(search);
        setPage(next);
        setList((prev: any) => [
            ...prev,
            ...res.results[0].hits
        ])
    }
    useEffect(() => {
        setList(props.result.results[0].hits);
    }, [props.result.results]);

    useEffect(() => {
        if (totalPages === page || totalPages === 0) {
            setDisplayLoader(false)
        }
        else inView && loadMore();
    }, [inView]);

    return (
        <>
            <h2 className="search-result-count">{searchedData?.estimatedTotalHits || searchedData?.totalHits} {searchedData.estimatedTotalHits === 1 || searchedData.totalHits === 1 ? 'result' : 'results'} from your search</h2>
            <Breadcrumb blockSecondLast={false} />
            <div className="grid lg:grid-cols-4 lg:gap-10">
                <div className="col-span-3">
                    <div className="grid grid-cols-1 gap-4 lg:gap-8 mb-4 lg:mb-10">
                        {list?.length > 0 ? list.map((data: any, i: any) => (
                            data.property_type === "PG" ? <PgItemsCard key={i} data={data} id={data.id} product={Products.pg} /> :
                            <ProductItemsCard key={i} data={data} id={data.id} product={props.product} />
                        )) :
                            <ZeroListingCard dashLink={Resource.PropertyListing.addDetailsLink} title={"property"} />}
                    </div>
                </div>
                <div className='hidden lg:block lg:col-span-1'>
                    <img className='w-full rounded-xl' src={CloudImages.SideBannerBusiness} />
                </div>
            </div>
            {displayLoader && <div ref={ref}><GlobalSearchListLoading /></div>}
        </>
    )
}

export default ProductItemsList