"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Button, Input, Link, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { Products, Resource } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentCard from '@/app/sub-components/payment-card';
import { CalculateDiscountPercentage, CheckSubscriptionValidity, GetOfferPeriodDateRange } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';

const Page = () => {
    const currentDate = new Date();
    const monthSpan = GetOfferPeriodDateRange();
    const [expiryDate, setExpiryDate] = useState(monthSpan);
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
    const [paymentData, setPaymentData] = useState<any>({});
    const [hasSubscribed, setHasSubscribed] = useState(false);
    const [pricingPlan, setPricingPlan] = useState<any>({});
    const [planDetails, setPlanDetails] = useState<any>({
        type: "",
        label: "Property Listing Plan",
        amount: 0,
        endpoint: Products.realEstate.api.base,
        propertyData: "",
        productName: ""
    });

    useEffect(() => {
        setListingFormBtnEl(null);
    }, [isSubmitLoading])

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.realEstate.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=${attr.populateForPayment}`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number < ListingWorkflow.Review && type !== "renew") router.push(`/dashboard/property-listing/view-all`);
                    const pricingPlanRes = await getPublicApiResponse(`${Products.realEstatePricingPlan.api.base}?populate=${data.listing_type}`);
                    // let amount = 0;
                    // let planLabel = "";
                    let priceDetails: any = {
                        amount: 0,
                        label: ""
                    }
                    if (pricingPlanRes.data.Rent) priceDetails = findPriceDetailsByRoomType(pricingPlanRes.data.Rent, data);
                    else if (pricingPlanRes.data.Sale) priceDetails = findPriceDetailsByRoomType(pricingPlanRes.data.Sale, data);
                    else if (pricingPlanRes.data.PG) priceDetails = findPriceDetailsByRoomType(pricingPlanRes.data.PG, data);
                    setPricingPlan({ monthly: priceDetails.amount });
                    setPlanDetails({ ...planDetails, type: 'Monthly', amount: priceDetails.amount, propertyData: priceDetails.label, productName: data.name });
                    data.payment_details && setHasSubscribed(CheckSubscriptionValidity(data.payment_details.expiry_date, data.payment_details.isPaymentSuccess));
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

    const findPriceDetailsByRoomType = (pricingPlan: any, data: any) => {
        let planData: any = 0;
        let planLabel: string = "";
        switch (data.property_type) {
            case "PG":
                planData = pricingPlan.find((x: any) => x.type === data.property_type);
                planLabel = "PG";
                break;

            case "Plot":
                planData = pricingPlan.find((x: any) => x.type === data.property_type);
                planLabel = "Plot for Sale";
                break;

            default:
                planData = pricingPlan.find((x: any) => x.type === data.details_by_listingtype[0].room_type);
                planLabel = `${data.details_by_listingtype[0].room_type} ${data.property_type} for ${data.listing_type}`
                break;
        }
        return {
            amount: planData.amount,
            label: planLabel
        }
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onClickSave = async () => {
        try {
            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/property-listing/view-all`)
            }
            else if (type === "new" || type === "renew") {
                toast.success("Your advertisement is sent for approval!");
                router.push(`/dashboard/advertise/view-all`)
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload images.");
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
                    <div className='listing-card border rounded-lg px-0 md:px-7 py-6 pb-0 md:pb-7 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5 px-7 md:px-0'>Property Details</div>
                        <div className='bg-color1d text-white rounded-lg p-5 md:p-8'>
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
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 relative'>
                <div className='flex flex-row lg:flex-col gap-5 mb-7'>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='flat' href={Resource.PropertyListing.addDetailsLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Details</Button>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='ghost' href={Resource.PropertyListing.uploadImagesLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Images</Button>
                </div>
                <PaymentCard
                    planDetails={planDetails}
                    expiryDate={expiryDate}
                    paymentData={paymentData}
                    hasSubscribed={hasSubscribed}
                    setHasSubscribed={setHasSubscribed}
                    onClickSave={onClickSave}
                    isOfferApplicable={false} />
            </div>
        </>
    )
}

export default Page