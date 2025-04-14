import { Skeleton } from '@heroui/react'
import React from 'react'

const CategoryBoxLoading = () => {
    return (
        <div className="relative">
            <div className="search-cat-sec">
                {Array.from({ length: 10 }).map((_, index) =>
                    <Skeleton className="mini-card" key={index}>
                        <div className="relative w-16 h-16 md:w-20 md:h-20" />
                    </Skeleton>
                )}
            </div>
        </div>
    )
}

export default CategoryBoxLoading