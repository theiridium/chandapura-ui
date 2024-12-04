"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import SingleImage from '@/app/components/media-upload-input/single-image';
import { useCallback, useEffect, useState } from 'react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { ImageParams } from '@/lib/typings/dto';
import ImgSingleUploadLoading from '@/app/loading-components/img-single-upload-loading';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import FormLoading from '@/app/loading-components/form-loading';
import { ListingWorkflow } from '@/lib/typings/enums';

const Page = ({ params }: { params: { slug: string } }) => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [isAdImageLoaded, setIsAdImageLoaded] = useState(false);
    const [keyAd, setKeyAd] = useState(0);
    const [imageParamsAd, setImageParamsAd] = useState<ImageParams>({
        refId: source,
        ref: "api::advertisement.advertisement",
        field: "ad_image",
        imgData: null,
    });
    const attr = Products.advertisement.api;
    const populateAdImage = useCallback(async () => {
        let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=ad_image`;
        const response = await getPublicApiResponse(apiUrl).then(res => res.data);
        if (response) {
            const data = response[0];
            setImageParamsAd({ ...imageParamsAd, imgData: data.ad_image });
        }
        setIsAdImageLoaded(true);
        return response;
    }, [])

    useEffect(() => {
        populateAdImage();
    }, [keyAd])

    const reloadAdComp = () => setKeyAd(prevKey => prevKey + 1);

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/advertise/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                let payload = {
                    step_number: ListingWorkflow.UploadImages,
                    publish_status: false
                }
                const endpoint = Products.advertisement.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Images saved successfully!");
                    router.push(`/dashboard/advertise/payment?type=${type}&source=${response.data.id}`)
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload images.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving Images for Advertisemnt..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                        {isAdImageLoaded ? <SingleImage key={keyAd} imageParams={imageParamsAd} uploadSuccess={reloadAdComp} /> :
                            <ImgSingleUploadLoading />}
                    </div>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onClick={() => router.push(`/dashboard/advertise/add-details?type=edit_back&source=${source}`)}>
                            Back
                        </Button>
                        <Button className='btn-primary text-base' color='primary' isDisabled={!imageParamsAd.imgData} isLoading={isSubmitLoading} onClick={onClickSave}>
                            {!isSubmitLoading && ((type === "edit") ? "Save" : "Save and Continue")}
                        </Button>
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