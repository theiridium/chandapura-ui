"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import SingleImage from '@/app/components/media-upload-input/single-image';
import { useCallback, useEffect, useState } from 'react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { ImageParams } from '@/lib/typings/dto';
import ImgSingleUploadLoading from '@/app/loading-components/img-single-upload-loading';
import { Button, useDisclosure } from '@nextui-org/react';
import { toast } from 'react-toastify';
import FormLoading from '@/app/loading-components/form-loading';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';
import BannerGuidlineModal from '@/app/components/modals/banner-guidline-modal';

const Page = ({ params }: { params: { slug: string } }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [isAdImageLoaded, setIsAdImageLoaded] = useState(false);
    const [keyAd, setKeyAd] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [imageParamsAd, setImageParamsAd] = useState<ImageParams>({
        refId: source,
        ref: "api::advertisement.advertisement",
        field: "ad_image",
        imgData: null,
        step_number: ListingWorkflow.UploadImages,
        publish_status: false,
        endpoint: Products.advertisement.api.base,
    });
    const attr = Products.advertisement.api;
    const populateAdImage = useCallback(async () => {
        let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=ad_image`;
        const response = await getPublicApiResponse(apiUrl).then(res => res.data);
        if (response) {
            const data = response[0];
            setImageParamsAd({ ...imageParamsAd, imgData: data.ad_image, step_number: data.step_number });
        }
        setIsAdImageLoaded(true);
        return response;
    }, [])

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg p-2 *:py-2 *:px-5 *:block font-semibold'>
            <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading || isloading} onPress={() => router.push(`/dashboard/advertise/add-details?type=edit_back&source=${source}`)}>
                Back
            </Button>
            <Button className='btn-primary text-base' color='primary' isDisabled={!imageParamsAd.imgData || editMode || isloading} isLoading={isSubmitLoading} onPress={onClickSave}>
                {!isSubmitLoading && ((type === "edit") ? "Save" : "Next")}
            </Button>
        </div>
    );

    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading, imageParamsAd, isloading])

    useEffect(() => {
        populateAdImage();
    }, [keyAd])

    useEffect(() => {
        handleOpen();
    }, [])


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
                toast.success("Image saved successfully!");
                router.push(`/dashboard/advertise/review?type=${type}&source=${source}`)
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload image.");
        } finally {
            setIsSubmitLoading(false);
        }
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = () => {
        onOpen();
    };

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving Images for Advertisemnt..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Banner Image</div>
                        <div className='mb-5 text-sm md:text-base'><span>Please follow the </span>
                            <span><Button onPress={() => handleOpen()} variant='flat' size='sm' color='primary' className='md:!text-sm'>Banner Image Guidline</Button></span>
                            <span> to upload the right size image for a better visibility of your content in both web and mobile view.</span></div>
                        {isAdImageLoaded ? <SingleImage key={keyAd} imageParams={imageParamsAd} uploadSuccess={reloadAdComp} setEditMode={setEditMode} setIsLoading={setIsLoading} /> :
                            <ImgSingleUploadLoading />}
                    </div>
                </div>
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
            <BannerGuidlineModal isOpen={isOpen} onClose={onClose} />
        </>
    )
}

export default Page