import React, { Suspense } from 'react'
import ItemListLoading from '../../../loading-components/item-list-loading'
import { Products } from '@/public/shared/app.config'
import SaleList from './sale-list'

const Sale = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3 mb-20">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Properties for Sale</h2>
                <a href={Products.sale.url} className="btn-explore_more">Explore More</a>
            </div>
            <div className="relative">
                <Suspense fallback={<ItemListLoading />}>
                    <SaleList />
                </Suspense>
            </div>
        </div>
    )
}

export default Sale