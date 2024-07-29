import React, { Suspense, useRef } from 'react'
import BuisnessList from './business-list'
import { Products } from '@/public/shared/app.config'
import BusinessListLoading from '@/app/loading-components/business-list-loading'

const Business = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Recently Added</h2>
                <a href={Products.business.url} className="btn-explore_more">Explore More</a>
            </div>
            <div className='relative'>
                <Suspense fallback={<BusinessListLoading />}>
                    <BuisnessList />
                </Suspense>
            </div>
        </div>
    )
}

export default Business