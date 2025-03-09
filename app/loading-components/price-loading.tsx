import { Skeleton } from '@nextui-org/react'
import React from 'react'

const PriceLoading = () => {
    return (
        <div className='dark-background'>
            <Skeleton className="rounded-lg w-auto h-10" />
        </div>
    )
}

export default PriceLoading