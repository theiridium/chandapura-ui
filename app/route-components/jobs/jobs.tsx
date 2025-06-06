import React, { Suspense, useRef } from 'react'
import { Products } from '@/public/shared/app.config'
import { Button, Link } from "@heroui/react"
import { MoveRight } from 'lucide-react'
import JobList from './job-list'
import ItemListLoading from '@/app/loading-components/item-list-loading'

const Jobs = () => {
    return (
        <div className="max-w-screen-xl mx-auto mb-20">
            <div className='flex justify-between mb-7 px-3'>
                <h2 className="category-title">Job Vacancies</h2>
                <Button className='btn-explore_more' variant='solid' href={Products.job.url} color='primary' radius='full' as={Link} size='sm' endContent={<MoveRight />}><span className='hidden md:block'>Explore More</span></Button>
            </div>
            <div className='relative px-3 lg:px-0'>
                <Suspense fallback={<ItemListLoading />}>
                    <JobList />
                </Suspense>
            </div>
        </div>
    )
}

export default Jobs