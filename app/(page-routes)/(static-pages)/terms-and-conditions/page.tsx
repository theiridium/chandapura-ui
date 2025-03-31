import FormLoading from '@/app/loading-components/form-loading';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { Products } from '@/public/shared/app.config';
import React, { Suspense } from 'react'

async function getData() {
    const res = await getPublicApiResponse(`${Products.termsConditions.api.base}`);
    return res.data;
}

const Page = async () => {
    const data = await getData();
    return (
        <Suspense fallback={<FormLoading />}>
            <div className='max-w-screen-xl min-h-screen mx-auto my-10 md:my-16 px-5'>
                <div className='my-5'><Breadcrumb /></div>
                <div className='doc-section' dangerouslySetInnerHTML={{ __html: data.terms_conditions }} />
            </div>
        </Suspense>
    )
}

export default Page