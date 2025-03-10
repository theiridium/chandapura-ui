"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Link, RadioGroup} from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import { Products, Resource } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';
import PaymentCard from '@/app/sub-components/payment-card';
import { CalculateDiscountPercentage, CheckSubscriptionValidity, GetOfferPeriodDateRangeMonthly, GetOfferPeriodDateRangeYearly } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';
import PricingRadio from '@/app/sub-components/pricing-radio';

const Page = () => {
    const currentDate = new Date();
    const monthSpan = GetOfferPeriodDateRangeMonthly();
    const yearSpan = GetOfferPeriodDateRangeYearly();
    const [expiryDate, setExpiryDate] = useState(monthSpan);
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
    const [planDetails, setPlanDetails] = useState<any>({
        type: "",
        label: "Business Listing Plan",
        amount: 0,
        endpoint: Products.business.api.base,
        dashUrl: Resource.BusinessListing.dashboardLink,
        productName: ""
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.business.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate[0]=category&populate[1]=sub_category&populate[3]=payment_details&populate[4]=payment_history`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    let pricing = data.sub_category.pricing;
                    setApiRes(data);
                    setPaymentData({
                        payment_details: data.payment_details,
                        payment_history: data.payment_history
                    })
                    if (pricing) {
                        const pricingPlanRes = await getPublicApiResponse(`${Products.businessListingPricingPlan.api.base}`);
                        setPricingPlan(pricingPlanRes.data);
                        if (data.step_number < ListingWorkflow.Review && type !== "renew") router.push(`/dashboard/business-listing/view-all`);
                        data.payment_details && setHasSubscribed(CheckSubscriptionValidity(data.payment_details.expiry_date_timestamp, data.payment_details.isPaymentSuccess));
                        setPlanDetails({ ...planDetails, productName: data.name });
                        setIsLoading(false);
                        return data;
                    }
                    else {
                        setPlanDetails({ ...planDetails, type: "Free" });
                        setPaymentData({ ...paymentData, isFreeListing: true });
                        setIsLoading(false);
                        return data;
                    }
                }
                else window.location.replace('/');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onPlanSelect = useCallback((type: string) => {
        setPlanDetails({ ...planDetails, type: type, amount: pricingPlan[type.toLowerCase()] });
        if (type === "Monthly") setExpiryDate(monthSpan);
        else setExpiryDate(yearSpan);
    }, [planDetails, pricingPlan])

    return (
        <>
            <div className='col-span-full lg:col-span-5 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Business Details</div>
                        <div className='bg-color1d text-white rounded-lg p-8'>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Business Name</div>
                                {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.name}</div>}
                            </div>
                            <div className='flex flex-col md:flex-row justify-between'>
                                <div className='mb-5 md:mb-0'>
                                    <div className='text-sm mb-1 font-semibold'>Business Category</div>
                                    {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.category.name}</div>}
                                </div>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Business Sub-Category</div>
                                    {isLoading ? <TextLoading /> : <div className='text-lg text-color2d'>{apiRes.sub_category.name}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='listing-card border rounded-lg px-0 md:px-7 py-6 pb-0 md:pb-7 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5 px-7 md:px-0'>Pricing Plan</div>
                        <div className='bg-color1d/10 rounded-lg p-5 md:p-8'>
                            <div className='w-full'>
                                {paymentData.isFreeListing ?
                                    (isLoading ? <TextLoading /> :
                                        <div className='text-center'>
                                            <p className='mb-5'>Yay! Your business category is eligible for free listing. 🎉</p>
                                            <p>Please proceed with checkout</p>
                                        </div>
                                    ) :
                                    <>
                                        {!hasSubscribed && Object.keys(pricingPlan).length > 0 && <RadioGroup label="Choose your Subscription" onValueChange={(value: any) => onPlanSelect(value)}
                                            classNames={{
                                                wrapper: "gap-5",
                                                label: "text-primary"
                                            }}>
                                            {isLoading ? <TextLoading /> :
                                                <PricingRadio value="Monthly">
                                                    <div className='text-sm md:text-base'>Monthly Subscription</div>
                                                    <div className='flex items-end mt-3'>
                                                        <div className='text-lg md:text-2xl font-medium flex items-center'>
                                                            <IndianRupee className='hidden md:block' strokeWidth={2} size={20} />
                                                            <span className='md:hidden'>₹</span>
                                                            {pricingPlan.monthly}
                                                        </div>
                                                        <span className='text-sm font-medium'>/month</span>
                                                    </div>
                                                </PricingRadio>
                                            }
                                            {isLoading ? <TextLoading /> :
                                                <PricingRadio value="Yearly">
                                                    <div className='text-sm md:text-base'>Yearly Subscription</div>
                                                    <div className='flex items-end text-xs md:text-base mt-3 mb-2'>
                                                        <div className='flex items-center line-through decoration-slate-500/60'><IndianRupee size={15} />{pricingPlan.monthly * 12}</div><span className='text-xs md:text-xs'>/year</span>
                                                        <div className='ml-2 bg-color1d/10 rounded-full px-5'>Save {CalculateDiscountPercentage(pricingPlan.monthly * 12, pricingPlan.yearly)}%</div>
                                                    </div>
                                                    <div className='flex items-end'>
                                                        <div className='text-lg md:text-2xl font-medium flex items-center'>
                                                            <IndianRupee className='hidden md:block' strokeWidth={2} size={20} />
                                                            <span className='md:hidden'>₹</span>
                                                            {pricingPlan.yearly}
                                                        </div>
                                                        <span className='text-sm font-medium'>/year</span>
                                                    </div>
                                                </PricingRadio>
                                            }
                                        </RadioGroup>}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 relative'>
                <div className='flex flex-row lg:flex-col gap-5 mb-7'>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='flat' href={Resource.BusinessListing.addDetailsLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Details</Button>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='ghost' href={Resource.BusinessListing.uploadImagesLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Images</Button>
                </div>
                <PaymentCard
                    planDetails={planDetails}
                    expiryDate={expiryDate}
                    paymentData={paymentData}
                    hasSubscribed={hasSubscribed}
                    setHasSubscribed={setHasSubscribed}
                    isOfferApplicable={false} />
            </div>
        </>
    )
}

export default Page