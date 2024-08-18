import React, { Suspense, useRef } from 'react'
import BuisnessList from './business-list'
import { Products } from '@/public/shared/app.config'
import BusinessListLoading from '@/app/loading-components/business-list-loading'
import { Button, Link } from '@nextui-org/react'
import { MoveRight } from 'lucide-react'

const Business = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Recently Added Business</h2>
                <Button className='btn-explore_more' variant='solid' href={Products.business.url} color='primary' radius='full' as={Link} size='sm' endContent={<MoveRight />}><span className='hidden md:block'>Explore More</span></Button>
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