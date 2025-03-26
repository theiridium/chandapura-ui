import React, { Suspense } from 'react'
import RentList from './rent-list'
import ItemListLoading from '../../../loading-components/item-list-loading'
import { Products } from '@/public/shared/app.config'
import { Button, Link } from "@heroui/react"
import { MoveRight } from 'lucide-react'

const Rent = () => {
    return (
        <div className="max-w-screen-xl mx-auto mb-20">
            <div className='flex justify-between mb-7 px-3'>
                <h2 className="category-title">Properties for Rent</h2>
                <Button className='btn-explore_more' variant='flat' href={Products.rent.url} color='primary' radius='full' size='sm' as={Link} endContent={<MoveRight />}><span className='hidden md:block'>Explore More</span></Button>
            </div>
            <div className="relative px-3 lg:px-0">
                <Suspense fallback={<ItemListLoading />}>
                    <RentList />
                </Suspense>
            </div>
        </div>
    )
}

export default Rent