import FormLoading from '@/app/loading-components/form-loading';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { Products } from '@/public/shared/app.config';
import React, { Suspense } from 'react'

async function getData() {
    const res = await getPublicApiResponse(`${Products.privacyPolicy.api.base}`);
    return res.data;
}

const Page = async () => {
    const data = await getData();
    return (
        <Suspense fallback={<FormLoading />}>
            <div className='max-w-screen-xl mx-auto my-10 md:my-16 px-5'>
                <div className='my-5'><Breadcrumb /></div>
                <div className='my-10'>
                    <h1 className="text-2xl md:text-4xl font-semibold text-slate-600 mb-8">Banner Image Guideline</h1>
                    <p className='text-sm md:text-base mb-8'>Please follow the bellow guidline to upload Banner Ad Image. For any queries, please contact us.</p>
                    <img src='/images/Banner_Ad_Guidline_Desc.jpg' />
                    <ul className='list-disc mx-5 text-sm md:text-base mt-8'>
                        <li>Ensure the minimum banner width to be 1536px with a height of 384px.</li>
                        <li>The inner rectangle indicates the visibility range in mobile view.</li>
                        <li>Please try to keep the main content in the center of banner within the width of 765px.</li>
                        <li>Following these dimenssions correctly would provide a better visibility and reach to your target customers through our website.</li>
                    </ul>
                </div>
            </div>
        </Suspense>
    )
}

export default Page