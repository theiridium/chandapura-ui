import { Skeleton } from '@nextui-org/react'
import React from 'react'

const ImgSingleUploadLoading = () => {
    return (
        <Skeleton className="rounded-lg">
            <div className="h-64 lg:h-80 rounded-lg bg-default-300"></div>
        </Skeleton>
    )
}

export default ImgSingleUploadLoading