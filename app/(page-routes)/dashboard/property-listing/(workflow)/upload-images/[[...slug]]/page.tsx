"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import SingleImage from '@/app/components/media-upload-input/single-image';
import MultiImage from '@/app/components/media-upload-input/multi-image';
import { useCallback, useEffect, useState } from 'react';
import { Products, Resource } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { ImageParams } from '@/lib/typings/dto';
import ImgSingleUploadLoading from '@/app/loading-components/img-single-upload-loading';
import ImgMultiUploadLoading from '@/app/loading-components/img-multi-upload-loading';
import { Button } from "@heroui/react";
import { toast } from 'react-toastify';
import FormLoading from '@/app/loading-components/form-loading';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';

const Page = () => {
    const [isloading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [isFeaturedImageLoaded, setIsFeaturedImageLoaded] = useState(false);
    const [isGalleryImagesLoaded, setIsGalleryImagesLoaded] = useState(false);
    const [isImagesInGallery, setIsImagesInGallery] = useState(false);
    const [keyFt, setKeyFt] = useState(0);
    const [keyGa, setKeyGa] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [imageParamsFeatured, setImageParamsFeatured] = useState<ImageParams>({
        refId: source,
        ref: "api::property-listing.property-listing",
        field: "featured_image",
        imgData: null,
        step_number: ListingWorkflow.UploadImages,
        publish_status: false,
        endpoint: Products.realEstate.api.base,
    });
    const [imageParamsGallery, setImageParamsGallery] = useState<ImageParams>({
        refId: source,
        ref: "api::property-listing.property-listing",
        field: "gallery_images",
        imgData: null,
        step_number: ListingWorkflow.UploadImages,
        publish_status: false,
        endpoint: Products.realEstate.api.base,
    });
    const attr = Products.realEstate.api;
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

    const reloadFeaturedComp = () => setKeyFt(prevKey => prevKey + 1);
    const reloadGalleryComp = () => setKeyGa(prevKey => prevKey + 1);

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/property-listing/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                toast.success("Images saved successfully!");
                router.push(`/dashboard/property-listing/review?type=${type}&source=${source}`)
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload images.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg p-2 *:py-2 *:px-5 *:block font-semibold'>
            <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading || isloading} onPress={() => router.push(`${Resource.PropertyListing.addDetailsLink}?type=edit_back&source=${source}`)}>
                Back
            </Button>
            <Button className='btn-primary text-base' color='primary' isDisabled={isImagesInGallery || !imageParamsFeatured.imgData || editMode || isloading} isLoading={isSubmitLoading} onPress={onClickSave}>
                {!isSubmitLoading && ((type === "edit") ? "Save" : "Save and Continue")}
            </Button>
        </div>
    );

    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading, imageParamsFeatured, imageParamsGallery, isloading])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving Images for Property..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Upload Media Files</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                        {isFeaturedImageLoaded ? <SingleImage key={keyFt} imageParams={imageParamsFeatured} uploadSuccess={reloadFeaturedComp} setEditMode={setEditMode} setIsLoading={setIsLoading} /> :
                            <ImgSingleUploadLoading />}
                    </div>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        {isGalleryImagesLoaded ? <MultiImage key={keyGa} imageParams={imageParamsGallery} setIsImagesInGallery={setIsImagesInGallery} uploadSuccess={reloadGalleryComp} setEditMode={setEditMode} allowedNumber={6} /> :
                            <ImgMultiUploadLoading />}
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