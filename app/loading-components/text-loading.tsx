import { Skeleton } from "@heroui/react"
import React from 'react'

const TextLoading = () => {
    return (
        <div className='dark-background'>
            <Skeleton className="rounded-lg w-auto h-7" />
        </div>
    )
}

export default TextLoading