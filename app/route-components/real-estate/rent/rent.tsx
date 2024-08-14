import React, { Suspense } from 'react'
import RentList from './rent-list'
import ItemListLoading from '../../../loading-components/item-list-loading'
import { Products } from '@/public/shared/app.config'
import { Button, Link } from '@nextui-org/react'
import { MoveRight } from 'lucide-react'

const Rent = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3 mb-20">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Properties for Rent</h2>
                <Button className='btn-explore_more' variant='flat' href={Products.rent.url} color='primary' radius='full' size='sm' as={Link} endContent={<MoveRight />}>Explore More</Button>
            </div>
            <div className="relative">
                <Suspense fallback={<ItemListLoading />}>
                    <RentList />
                </Suspense>
            </div>
        </div>
    )
}

export default Rent