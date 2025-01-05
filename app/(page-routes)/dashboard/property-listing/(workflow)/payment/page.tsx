"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Button, Input, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { Products } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentCard from '@/app/sub-components/payment-card';
import { calculateDiscountPercentage, checkSubscriptionValidity } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';

const Page = () => {
    const currentDate = new Date();
    const monthSpan = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const [expiryDate, setExpiryDate] = useState(monthSpan);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [apiRes, setApiRes] = useState<any>();
    const [paymentData, setPaymentData] = useState<any>({});
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const [pricingPlan, setPricingPlan] = useState<any>({});
    const [listingPrice, setListingPrice] = useState<any>({
        type: "",
        amount: 0
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.realEstate.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=${attr.populateForPayment}`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number !== ListingWorkflow.UploadImages && type !== "renew") router.push(`/dashboard/property-listing/view-all`);
                    const pricingPlanRes = await getPublicApiResponse(`${Products.realEstatePricingPlan.api.base}?populate=${data.listing_type}`);
                    let amount = 0;
                    if (pricingPlanRes.data.Rent) amount = findPriceByRoomType(pricingPlanRes.data.Rent, data);
                    else if (pricingPlanRes.data.Sale) amount = findPriceByRoomType(pricingPlanRes.data.Sale, data);
                    else if (pricingPlanRes.data.PG) amount = findPriceByRoomType(pricingPlanRes.data.PG, data);
                    setPricingPlan({ monthly: amount });
                    setListingPrice({ type: 'Monthly', amount: amount });
                    data.payment_details && setHasSubscribed(checkSubscriptionValidity(data.payment_details.expiry_date, data.payment_details.isPaymentSuccess));
                    setApiRes(data);
                    setPaymentData({
                        payment_details: data.payment_details,
                        payment_history: data.payment_history
                    })
                    setIsLoading(false);
                    return data;
                }
                else window.location.replace('/');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    const findPriceByRoomType = (pricingPlan: any, data: any) => {
        let planData: any = 0;
        switch (data.property_type) {
            case "PG":
                planData = pricingPlan.find((x: any) => x.type === data.property_type);
                break;

            case "Plot":
                planData = pricingPlan.find((x: any) => x.type === data.property_type);
                break;

            default:
                planData = pricingPlan.find((x: any) => x.type === data.details_by_listingtype[0].room_type);
                break;
        }
        return planData.amount;
    }

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
                toast.success("Payment details saved successfully!");
                router.push(`/dashboard/property-listing/publish?type=${type}&source=${source}`)
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
            {isSubmitLoading && <FormLoading text={"Saving your payment details..."} />}
            <div className='col-span-full lg:col-span-5 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Property Details</div>
                        <div className='bg-color1d text-white rounded-lg p-8'>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Property Name</div>
                                {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.name}</div>}
                            </div>
                            <div className='flex flex-col md:flex-row justify-between'>
                                <div className='mb-5 md:mb-0'>
                                    <div className='text-sm mb-1 font-semibold'>Listing Type</div>
                                    {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.listing_type}</div>}
                                </div>
                                {apiRes?.property_type !== "PG" &&
                                    <>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Property Type</div>
                                            {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.property_type}</div>}
                                        </div>
                                        {apiRes?.property_type !== "Plot" &&
                                            <div>
                                                <div className='text-sm mb-1 font-semibold'>Room Type</div>
                                                {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.details_by_listingtype[0].room_type}</div>}
                                            </div>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Pricing Plan</div>
                        <div className='bg-color1d/10 rounded-lg p-16'>
                            <div className='w-full'>
                                {isLoading ? <TextLoading /> :
                                    <div className='flex items-end justify-center'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />{pricingPlan.monthly}</div><span className='font-semibold'>/month</span></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 lg:mx-0 relative'>
                <PaymentCard
                    pricing={listingPrice}
                    expiryDate={expiryDate}
                    paymentData={paymentData}
                    hasSubscribed={hasSubscribed}
                    setHasSubscribed={setHasSubscribed}
                    isOfferApplicable={false}
                    endpoint={Products.realEstate.api.base} />
            </div>
            <div className='col-span-full lg:col-start-3 lg:col-span-5 mt-3 lg:mt-0 mb-8 mx-2 lg:mx-0'>
                <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                    <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onPress={() => router.push(`/dashboard/property-listing/upload-images?type=edit_back&source=${source}`)}>
                        Back
                    </Button>
                    <Button className='btn-primary text-base' color='primary' isDisabled={!hasSubscribed} isLoading={isSubmitLoading} onPress={onClickSave}>
                        {!isSubmitLoading && "Continue to Preview"}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Page