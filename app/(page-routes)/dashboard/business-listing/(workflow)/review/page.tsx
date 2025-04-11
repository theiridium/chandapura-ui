"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Link } from "@heroui/react";
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { useSession } from 'next-auth/react';
import { Products, Resource } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';
import ViewLocationMap from '@/app/components/maps/view-location-map';

const Page = () => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [apiRes, setApiRes] = useState<any>();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.business.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number < ListingWorkflow.UploadImages) router.push(`/dashboard/business-listing/view-all`);
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
                router.push(`/dashboard/business-listing/view-all`)
            }
            else if (type === "new" || type === "renew" || type === 'edit_back') {
                let payload = {
                    // step_number: type === "new" ? ListingWorkflow.Review : apiRes.step_number,
                    step_number: ListingWorkflow.Payment,
                }
                const endpoint = Products.business.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    // toast.success("Let's proceed with Payment");
                    // router.push(`/dashboard/business-listing/payment?type=${type}&source=${source}`)
                    toast.success("Your Business has been uploaded sucessfully!");
                    router.push(`/dashboard/business-listing/view-all`)
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to publish. Please contact our support team.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg p-2 *:py-2 *:px-5 *:block font-semibold'>
            <Button className='btn-primary text-base' color='primary' isDisabled={isLoading} isLoading={isSubmitLoading} onPress={onClickSave}>
                {!isSubmitLoading && "Submit"}
            </Button>
        </div>
    );

    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading, isLoading])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Submitting your business listing..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/2'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Category</div>
                                    <div>{apiRes.category.name}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Sub-Category</div>
                                    <div>{apiRes.sub_category.name}</div>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Business Name</div>
                                <div>{apiRes.name}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Description</div>
                                <div>{apiRes.description}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Business Website</div>
                                <div>{apiRes.website}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Location</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Area</div>
                                <div>{apiRes.area.name}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Full Address</div>
                                <div>{apiRes.full_address}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-3 font-semibold'>Map Location</div>
                                <ViewLocationMap coordinates={apiRes.location.coordinates} />
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Business Contact Details</div>
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
                                <div className='text-sm mb-1 font-semibold'>Business Email ID</div>
                                <div>{apiRes.contact.contact_email_id}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Services</div>
                            {apiRes.services && <div className="tags">
                                {apiRes.services.map((x: any, i: any) =>
                                    <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.trim()}</div>
                                )}
                            </div>}
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Business Hours</div>
                            <div className='time-table overflow-x-auto'>
                                <table className='table-fixed md:table-auto text-center divide-y w-full whitespace-nowrap'>
                                    <thead>
                                        <tr className='*:py-3'>
                                            <th className='w-32 md:w-auto'></th>
                                            <th className='w-32 md:w-auto'></th>
                                            <th className='w-32 md:w-auto'>Opening Time</th>
                                            <th className='w-24 md:w-auto'></th>
                                            <th className='w-32 md:w-auto'>Closing Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className='md:text-lg font-medium divide-y'>
                                        {apiRes.bus_hours.map((x: any, i: any) =>
                                            <tr className='*:py-3' key={i}>
                                                <td className='text-left'>{x.day}</td>
                                                <td><span className={`${x.isOpen ? 'bg-green-400' : 'bg-red-400'} text-white px-3 py-1 rounded-full`}>{x.isOpen ? "Open" : "Closed"}</span></td>
                                                {x.isOpen &&
                                                    <>
                                                        <td>{x.open_time[0].toString()}</td>
                                                        <td>TO</td>
                                                        <td>{x.close_time[0].toString()}</td>
                                                    </>
                                                }
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
                        {/* <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Advertisement</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Is this business opted for advertisement?</div>
                                <div>{apiRes.advertisement ? 'Yes' : 'No'}</div>
                            </div>
                            {apiRes.advertisement && <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Ad Banner Image</div>
                                <img src={apiRes.advertisement.ad_image.url} />
                            </div>}
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Ad Banner Image</div>
                                <img src={apiRes.advertisement.ad_image.url} />
                            </div>
                        </div> */}
                    </div>
                }
            </div>
            <div className='col-span-full lg:col-span-2 mt-3 lg:my-8 mx-5 lg:mx-2'>
                <div className='flex flex-row lg:flex-col gap-5 mb-7'>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='flat' href={Resource.BusinessListing.addDetailsLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Details</Button>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='ghost' href={Resource.BusinessListing.uploadImagesLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Images</Button>
                </div>
            </div>
        </>
    )
}

export default Page