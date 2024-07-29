import React, { Suspense } from 'react'
import ClassifiedsList from './classifieds-list'
import ItemListLoading from '../../loading-components/item-list-loading'

const Classifieds = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3 mb-20">
            <h2 className="category-title mb-7">Classifieds</h2>
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-5 lg:gap-7">
                <Suspense fallback={<ItemListLoading />}>
                    <ClassifiedsList />
                </Suspense>
            </div>
        </div>
    )
}

export default Classifieds