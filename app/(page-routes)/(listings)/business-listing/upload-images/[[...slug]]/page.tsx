"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import SingleImage from '@/app/components/media-upload-input/single-image';
import MultiImage from '@/app/components/media-upload-input/multi-image';
import { useCallback, useEffect, useState } from 'react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { ImageParams } from '@/lib/typings/dto';
import ImgSingleUploadLoading from '@/app/loading-components/img-single-upload-loading';
import ImgMultiUploadLoading from '@/app/loading-components/img-multi-upload-loading';
import { Button } from '@nextui-org/react';
import { toast } from 'react-toastify';
import FormSubmitLoading from '@/app/loading-components/form-submit-loading';

const Page = ({ params }: { params: { slug: string } }) => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [isFeaturedImageLoaded, setIsFeaturedImageLoaded] = useState(false);
    const [isGalleryImagesLoaded, setIsGalleryImagesLoaded] = useState(false);
    const [keyFt, setKeyFt] = useState(0);
    const [keyGa, setKeyGa] = useState(0);
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
    const attr = Products.business.api;
    const populateFeaturedImage = useCallback(async () => {
        let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=featured_image`;
        const response = await getPublicApiResponse(apiUrl).then(res => res.data);
        if (response) {
            const data = response[0];
            setImageParamsFeatured({ ...imageParamsFeatured, imgData: data.featured_image });
        }
        setIsFeaturedImageLoaded(true);
        return response;
    }, [])
    const populateGalleryImages = useCallback(async () => {
        if (source) {
            let apiUrl = `${attr.base}?filters[id][$eq]=${source}&populate=gallery_images`;
            const response = await getPublicApiResponse(apiUrl).then(res => res.data);
            if (response) {
                const data = response[0];
                setImageParamsGallery({ ...imageParamsGallery, imgData: data.gallery_images });
            }
            setIsGalleryImagesLoaded(true);
            return response;
        }
        else window.location.replace('/');
    }, [])

    useEffect(() => {
        populateFeaturedImage();
    }, [keyFt])

    useEffect(() => {
        populateGalleryImages();
    }, [keyGa])

    const reloadFeaturedComp = () => setKeyFt(prevKey => prevKey + 1);;
    const reloadGalleryComp = () => setKeyGa(prevKey => prevKey + 1);;

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/business-listing`)
            }
            else if (type === "new" || type === "edit_back") {
                let payload = {
                    step_number: 3
                }
                const endpoint = Products.business.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Images saved successfully!");
                    router.push(`/business-listing/payment?type=${type}&source=${response.data.id}`)
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
            {isSubmitLoading && <FormSubmitLoading text={"Saving Images for Business..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                        {isFeaturedImageLoaded ? <SingleImage key={keyFt} imageParams={imageParamsFeatured} uploadSuccess={reloadFeaturedComp} /> :
                            <ImgSingleUploadLoading />}
                    </div>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Gallery Images</div>
                        {isGalleryImagesLoaded ? <MultiImage key={keyGa} imageParams={imageParamsGallery} uploadSuccess={reloadGalleryComp} /> :
                            <ImgMultiUploadLoading />}
                    </div>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onClick={() => router.push(`/business-listing/add-details?type=edit_back&source=${source}`)}>
                            Back
                        </Button>
                        <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading} onClick={onClickSave}>
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