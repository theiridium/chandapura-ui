"use client"
import React from 'react'
import ClassifiedItemsCard from './classified-items-card'
import Breadcrumb from '@/app/sub-components/breadcrumb';

const ClassifiedItemsList = (props: any) => {
    const classifiedData = props.isSearchHit ? props.result.results[0].hits : props.result.data;
    const searchedData = props.isSearchHit ? props.result.results[0] : null;

    return (
        <>
            {!props.isSearchHit && <h2 className="text-lg mb-4 mx-2 lg:mx-auto lg:mb-4">{props.result.meta.pagination.total} {props.result.meta.pagination.total === 1 ? 'result' : 'results'} from your search</h2>}
            {props.isSearchHit && <h2 className="text-lg mb-4 mx-2 lg:mx-auto lg:mb-4">{searchedData.estimatedTotalHits} {searchedData.estimatedTotalHits === 1 ? 'result' : 'results'} from your search</h2>}
            <Breadcrumb blockSecondLast={true} />
            <div className="grid lg:grid-cols-4 lg:gap-10">
                <div className="col-span-3">
                    <div className="grid grid-cols-1 gap-4 lg:gap-8 mb-4 lg:mb-10">
                        {classifiedData && classifiedData.map((data: any, i: any) => (
                            <ClassifiedItemsCard key={i} data={data} id={data.id} product={props.product} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClassifiedItemsList