import React, { Suspense, useRef } from 'react'
import { Products } from '@/public/shared/app.config'
import { Button, Link } from '@nextui-org/react'
import { MoveRight } from 'lucide-react'
import ClassifiedList from './classified-list'
import ItemListLoading from '@/app/loading-components/item-list-loading'

const Classifieds = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-3">
            <div className='flex justify-between mb-7'>
                <h2 className="category-title">Classifieds</h2>
                <Button className='btn-explore_more' variant='solid' href={Products.classifieds.url} color='primary' radius='full' as={Link} size='sm' endContent={<MoveRight />}><span className='hidden md:block'>Explore More</span></Button>
            </div>
            <div className='relative'>
                <Suspense fallback={<ItemListLoading />}>
                    <ClassifiedList />
                </Suspense>
            </div>
        </div>
    )
}

export default Classifieds