import { Skeleton } from '@heroui/react'
import React from 'react'

const MarqueeTextLoading = () => {
    return (
        <Skeleton className=''>
            <div className='h-11 md:h-16 bg-color1d/10'></div>
        </Skeleton>
    )
}

export default MarqueeTextLoading