import React, { Suspense } from 'react'
import ItemListLoading from '../../../loading-components/item-list-loading'
import { Products } from '@/public/shared/app.config'
import SaleList from './sale-list'
import { Button, Link } from '@nextui-org/react'
import { MoveRight } from 'lucide-react'

const Sale = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3 mb-20">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Properties for Sale</h2>
                <Button className='btn-explore_more' variant='flat' href={Products.sale.url} color='primary' radius='full' size='sm' as={Link} endContent={<MoveRight />}>Explore More</Button>
            </div>
            <div className="relative">
                <Suspense fallback={<ItemListLoading />}>
                    <SaleList />
                </Suspense>
            </div>
        </div>
    )
}

export default Sale