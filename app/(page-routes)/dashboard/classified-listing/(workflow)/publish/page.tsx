"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { useSession } from 'next-auth/react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';
import { ListingWorkflow } from '@/lib/typings/enums';

const Page = () => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [apiRes, setApiRes] = useState<any>();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.classifieds.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number !== ListingWorkflow.UploadImages) router.push(`/dashboard/classified-listing/view-all`);
                    setApiRes(data);
                    setIsLoading(false);
                    return data;
                }
                else window.location.replace('/');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/classified-listing/view-all`)
            }
            else if (type === "new" || type === "renew") {
                let payload = {
                    step_number: ListingWorkflow.Publish
                }
                const endpoint = Products.classifieds.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Your classified product has been uploaded sucessfully!");
                    router.push(`/dashboard/classified-listing/view-all`)
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to publish. Please contact our support team.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Publishing your classified product..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review & Publish</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Product Category</div>
                                    <div>{apiRes.category.name}</div>
                                </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Product Name</div>
                                <div>{apiRes.name}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Amount for Sale</div>
                                <div>{apiRes.sale_amount}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Product Description</div>
                                <div>{apiRes.description}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Location</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Area</div>
                                <div>{apiRes.area.name}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Contact Details</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/3'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Contact Name</div>
                                    <div>{apiRes.contact.contact_name}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Conatct Number</div>
                                    <div>{apiRes.contact.contact_number}</div>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Contact Email ID</div>
                                <div>{apiRes.contact.contact_email_id}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Featured Image</div>
                            {apiRes.featured_image ? <img src={apiRes.featured_image.url} /> : "No featured image uploaded"}
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Gallery Images</div>
                            <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
                                {apiRes.gallery_images ?
                                    apiRes.gallery_images.map((img: any, i: any) => <img key={i} src={img.url} />) :
                                    "No gallery image uploaded"}
                            </div>
                        </div>
                        <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                            <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading} onPress={onClickSave}>
                                {!isSubmitLoading && "Publish"}
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
        </>
    )
}

export default Page