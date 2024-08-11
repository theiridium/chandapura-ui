import { Skeleton } from '@nextui-org/react'
import React from 'react'

const ImgMultiUploadLoading = () => {
    return (
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
            <Skeleton className="rounded-lg">
                <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 rounded-lg"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
                <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 rounded-lg"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
                <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 rounded-lg"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
                <div className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 rounded-lg"></div>
            </Skeleton>
        </div>
    )
}

export default ImgMultiUploadLoading