"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { useSession } from 'next-auth/react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';

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
                const attr = Products.advertisement.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
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
                router.push(`/dashboard/advertise/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                let payload = {
                    step_number: 5,
                    publish_status: true
                }
                const endpoint = Products.advertisement.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Your advertisement is published successfully!");
                    router.push(`/dashboard/advertise/view-all`)
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
            {isSubmitLoading && <FormLoading text={"Publishing your Advertisement..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review & Publish</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Business Name</div>
                                <div className='md:text-lg'>{apiRes.name}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Business Website</div>
                                <div className='md:text-lg'>
                                    <a href={apiRes.website}>{apiRes.website}</a>
                                </div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Business Contact Details</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/3'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Contact Name</div>
                                    <div className='md:text-lg'>{apiRes.contact.contact_name}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Conatct Number</div>
                                    <div className='md:text-lg'>{apiRes.contact.contact_number}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Business Email ID</div>
                                    <div className='md:text-lg'>{apiRes.contact.contact_email_id}</div>
                                </div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Banner Image</div>
                            {apiRes.ad_image ? <img src={apiRes.ad_image.url} /> : "No banner image uploaded"}
                        </div>
                        <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                            <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading} onClick={onClickSave}>
                                Publish
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