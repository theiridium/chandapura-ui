"use client"
import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/app/sub-components/breadcrumb';
import JobItemsCardPersonal from './job-items-card-personal';
import { useInView } from 'react-intersection-observer';
import { getSearchResult } from '@/app/actions';
import GlobalSearchListLoading from '@/app/loading-components/global-search-list-loading';
import JobItemsCardCorporate from './job-items-card-corporate';
import { CloudImages } from '@/public/shared/app.config';

const JobItemsList = (props: any) => {
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
            <h2 className="text-lg mb-4 mx-2 lg:mx-auto lg:mb-4">{searchedData?.estimatedTotalHits || searchedData?.totalHits} {searchedData.estimatedTotalHits === 1 || searchedData.totalHits === 1 ? 'result' : 'results'} from your search</h2>
            <Breadcrumb blockSecondLast={false} />
            <div className="grid lg:grid-cols-7 lg:gap-10">
                {/* <div className='col-span-2'>
                    <JobFilters />
                </div> */}
                <div className="col-span-3">
                    <div className="grid grid-cols-1 gap-4 lg:gap-8 mb-4 lg:mb-10">
                        {list && list.map((data: any, i: any) => (
                            data.category === "Corporate"?
                            <JobItemsCardCorporate key={i} data={data} id={data.id} product={props.product} />:
                            <JobItemsCardPersonal key={i} data={data} id={data.id} product={props.product} />
                        ))}
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

export default JobItemsList