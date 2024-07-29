"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import SingleImage from '@/app/components/media-upload-input/single-image';
import MultiImage from '@/app/components/media-upload-input/multi-image';
import { useCallback, useEffect, useState } from 'react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse } from '@/lib/interceptor';
import { ImageParams } from '@/lib/typings/dto';

const Page = ({ params }: { params: { slug: string } }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [isImageDataLoaded, setImageDataLoaded] = useState(false);
    const [imageParamsFeatured, setImageParamsFeatured] = useState<ImageParams>({
        refId: source,
        ref: "api::business-listing.business-listing",
        field: "featured_image",
        imgData: null,
    });
    const [imageParamsGallery, setImageParamsGallery] = useState<ImageParams>({
        refId: source,
        ref: "api::business-listing.business-listing",
        field: "gallery_images",
        imgData: null,
    });
    const populateBusinessDetails = useCallback(async () => {
        const attr = Products.business.api;
        let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=gallery_images,featured_image`;
        const response = await getPublicApiResponse(apiUrl).then(res => res.data);
        const data = response[0];
        if (data) {
            setImageParamsFeatured({ ...imageParamsFeatured, imgData: data.featured_image });
            setImageParamsGallery({ ...imageParamsGallery, imgData: data.gallery_images });
        }
        setImageDataLoaded(true);
        return data;
    }, [])

    useEffect(() => {
        populateBusinessDetails();
    }, [])

    return (
        <>
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                        {isImageDataLoaded && <SingleImage imageParams={imageParamsFeatured} />}
                    </div>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Gallery Images</div>
                        {isImageDataLoaded && <MultiImage imageParams={imageParamsGallery} />}
                    </div>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <button className='btn-primary text-base' onClick={() => router.push(`/business-listing/add-details/${source}`)}>Back</button>
                        <button className='btn-primary text-base' onClick={() => router.push('/business-listing/payment')}>Save and Continue</button>
                    </div>
                </div>
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
        </>
    )
}

export default Page