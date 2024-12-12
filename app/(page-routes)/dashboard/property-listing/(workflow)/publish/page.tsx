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
                const attr = Products.realEstate.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number !== ListingWorkflow.Payment) router.push(`/dashboard/property-listing/view-all`);
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
                router.push(`/dashboard/property-listing/view-all`)
            }
            else if (type === "new" || type === "renew") {
                let payload = {
                    step_number: ListingWorkflow.Publish
                }
                const endpoint = Products.realEstate.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Your property listing has been uploaded sucessfully!");
                    router.push(`/dashboard/property-listing/view-all`)
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
            {isSubmitLoading && <FormLoading text={"Publishing your property..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review & Publish</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/2'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Listing Type</div>
                                    <div>{apiRes.listing_type}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Property Type</div>
                                    <div>{apiRes.property_type}</div>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/2'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Room Type</div>
                                    <div>{apiRes.room_type}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Property Name</div>
                                    <div>{apiRes.name}</div>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Description</div>
                                <div>{apiRes.description}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Property Details</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/3'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Carpet Area</div>
                                    <div>{apiRes.property_details.carpet_area} sqft</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Direction</div>
                                    <div>{apiRes.property_details.direction} facing</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Number of Bathrooms</div>
                                    <div>{apiRes.property_details.bathrooms}</div>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/3'>
                                {apiRes.property_type === "Apartment" ?
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Floor Number</div>
                                        <div>{apiRes.property_details.floor_number}</div>
                                    </div> :
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Total Floors</div>
                                        <div>{apiRes.property_details.total_floors}</div>
                                    </div>
                                }
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Furnishing</div>
                                    <div>{apiRes.property_details.furnishing}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Parking Type</div>
                                    <div>{apiRes.property_details.parking_type}</div>
                                </div>
                            </div>
                            <div className='mt-2 mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Amenities</div>
                                {apiRes.amenities && <div className="tags">
                                    {apiRes.amenities.map((x: any, i: any) =>
                                        <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.name.trim()}</div>
                                    )}
                                </div>}
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Listed Amount</div>
                            {apiRes.listing_type === "Rent" ?
                                <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/2'>
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Monthly Rent</div>
                                        <div>{apiRes.property_details.rental_amount}</div>
                                    </div>
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Security Deposit</div>
                                        <div>{apiRes.property_details.deposit_amount}</div>
                                    </div>
                                </div> :
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Selling Amount</div>
                                    <div>{apiRes.property_details.selling_amount}</div>
                                </div>
                            }
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
                                <div className='text-sm mb-1 font-semibold'>Map Location</div>
                                <div>{apiRes.area.name}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Property Contact Details</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/2'>
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
                                <div className='text-sm mb-1 font-semibold'>Email ID</div>
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