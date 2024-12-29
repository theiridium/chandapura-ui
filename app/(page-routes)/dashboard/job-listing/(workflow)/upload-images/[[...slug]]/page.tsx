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
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [keyJl, setKeyJl] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [imageParams, setImageParams] = useState<ImageParams>({
        refId: source,
        ref: "api::job-listing.job-listing",
        field: "logo_image",
        imgData: null,
    });
    const [apiPayload, setApiPayload] = useState<any>({
        endpoint: Products.job.api.base,
        payload: {
            step_number: ListingWorkflow.UploadImages,
            publish_status: false
        },
        id: source
    })
    const attr = Products.job.api;
    const populateImage = useCallback(async () => {
        let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=logo_image`;
        const response = await getPublicApiResponse(apiUrl).then(res => res.data);
        if (response) {
            const data = response[0];
            setImageParams({ ...imageParams, imgData: data.logo_image });
        }
        setIsImageLoaded(true);
        return response;
    }, [])

    useEffect(() => {
        populateImage();
    }, [keyJl])

    const reloadAdComp = () => setKeyJl(prevKey => prevKey + 1);

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/job-listing/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                toast.success("Image saved successfully!");
                router.push(`/dashboard/job-listing/publish?type=${type}&source=${source}`)
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload image.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving Logo Image..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                        {isImageLoaded ? <SingleImage key={keyJl} imageParams={imageParams} uploadSuccess={reloadAdComp} setEditMode={setEditMode} apiPayload={apiPayload} /> :
                            <ImgSingleUploadLoading />}
                    </div>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onPress={() => router.push(`/dashboard/job-listing/add-details?type=edit_back&source=${source}`)}>
                            Back
                        </Button>
                        <Button className='btn-primary text-base' color='primary' isDisabled={!imageParams.imgData || editMode} isLoading={isSubmitLoading} onPress={onClickSave}>
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