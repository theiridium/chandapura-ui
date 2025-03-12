"use client"
import Breadcrumb from '@/app/sub-components/breadcrumb'
import CategoryRefTable from '@/app/tables/category-ref-table'
import React from 'react'

const Page = () => {
    return (
        <>
            <div className='m-5'><Breadcrumb /></div>
            <div className='max-w-screen-xl min-h-screen mx-auto px-3 my-10 md:my-16'>
                <div className='text-center mb-16'>
                    <h1 className="text-2xl md:text-4xl font-semibold mb-8 text-slate-600">Category Reference Book</h1>
                    <p className='my-5 text-sm md:text-xl font-light'>Find the perfect category for your business on Chandapura.com and get noticed by the right audience! 🚀</p>
                    <p className='my-5 text-xs md:text-base'>If you don&apos;t see a suitable category, no worries! Just reach out to us on
                        <a className='text-green-600 font-semibold' aria-label="Chat on WhatsApp" target="_blank" href="https://wa.me/9739004545?text=Hi%2C%20I%27m%20looking%20for%20a%20support%20from%20Chandapura.com"> WhatsApp</a>,
                        and we&apos;ll help you get listed.</p>
                </div>
                <CategoryRefTable />
            </div>
        </>
    )
}

export default Page