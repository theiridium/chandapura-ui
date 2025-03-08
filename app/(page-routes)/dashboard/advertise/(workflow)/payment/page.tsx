"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Button, Input, Link, RadioGroup, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { Products, Resource } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentCard from '@/app/sub-components/payment-card';
import { CalculateDiscountPercentage, CheckSubscriptionValidity } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';
import PricingRadio from '@/app/sub-components/pricing-radio';

const Page = () => {
    const currentDate = new Date();
    const monthSpan = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const yearSpan = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)).toISOString();
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
        label: "Advertisement Plan",
        amount: 0,
        endpoint: Products.advertisement.api.base,
        productName: ""
    });

    useEffect(() => {
        setListingFormBtnEl(null);
    }, [isSubmitLoading])

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const pricingPlanRes = await getPublicApiResponse(`${Products.advertisementPricingPlan.api.base}`);
                setPricingPlan(pricingPlanRes.data);
                const attr = Products.advertisement.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate[0]=payment_details&populate[1]=payment_history`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    if (data.step_number < ListingWorkflow.Review && type !== "renew") router.push(`/dashboard/advertise/view-all`);
                    data.payment_details && setHasSubscribed(CheckSubscriptionValidity(data.payment_details.expiry_date, data.payment_details.isPaymentSuccess));
                    setApiRes(data);
                    setPlanDetails({ ...planDetails, productName: data.name });
                    setPaymentData({
                        payment_details: data.payment_details,
                        payment_history: data.payment_history
                    });
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
            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/advertise/view-all`)
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

    const onPlanSelect = useCallback((type: string) => {
        setPlanDetails({ ...planDetails, type: type, amount: pricingPlan[type.toLowerCase()] });
        if (type === "Monthly") setExpiryDate(monthSpan);
        else setExpiryDate(yearSpan);
    }, [planDetails, pricingPlan])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving your payment details..."} />}
            <div className='col-span-full lg:col-span-5 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-0 md:px-7 py-6 pb-0 md:pb-7 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5 px-7 md:px-0'>Pricing Plan</div>
                        <div className='bg-color1d/10 rounded-lg p-5 md:p-8'>
                            <div className='w-full'>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 relative'>
                <div className='flex flex-row lg:flex-col gap-5 mb-7'>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='flat' href={Resource.Advertisement.addDetailsLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Details</Button>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='ghost' href={Resource.Advertisement.uploadImagesLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Images</Button>
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