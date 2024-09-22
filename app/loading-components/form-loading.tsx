import React from 'react'
import Image from 'next/image'

const FormLoading = ({text}: any) => {
    return (
        <div className='fixed w-screen h-screen top-0 right-0 bg-overlay/50 z-30 grid place-content-center'>
            <div className='text-center'>
                <Image className='mx-auto' height={150} width={150} src={'/images/gif/listing_loader_small.gif'} alt='Loading...' />
                <div className='text-white'>{text}</div>
            </div>
        </div>
    )
}

export default FormLoading