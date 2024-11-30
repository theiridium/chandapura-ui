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
    const expiryDate = "2025-01-03T00:00:00.000Z";
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
    const [adPrice, setAdPrice] = useState<any>({
        type: "",
        amount: 0
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const pricingPlanRes = await getPublicApiResponse(`${Products.advertisementPricingPlan.api.base}`);
            setPricingPlan(pricingPlanRes.data);
            if (source) {
                const attr = Products.advertisement.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate[0]=payment_details&populate[1]=payment_history`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    data.payment_details && setHasSubscribed(checkSubscriptionValidity(data.payment_details.expiry_date, data.payment_details.isPaymentSuccess));
                    setApiRes(data);
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
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/advertise/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                let payload = {
                    step_number: ListingWorkflow.Payment,
                    purchase_date: currentDate.toISOString(),
                    expiry_date: expiryDate
                }
                const endpoint = Products.advertisement.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Payment details saved successfully!");
                    router.push(`/dashboard/advertise/publish?type=${type}&source=${response.data.id}`)
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload images.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    const onSelectAdPrice = useCallback((type: string, amount: number) => {
        setAdPrice({ type: type, amount: amount });
    }, [])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Saving your payment details..."} />}
            <div className='col-span-full lg:col-span-5 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Pricing Plan</div>
                        <div className='bg-color1d/10 rounded-lg p-8'>
                            <div className='w-full'>
                                <Tabs fullWidth color='secondary' radius='full' size='lg' aria-label="Pricing Tabs"
                                    classNames={{
                                        tabList: "bg-color2d/40 p-0",
                                        tabContent: "text-black",
                                        tab: "z-10"
                                    }}>
                                    <Tab key="monthly" title="Monthly">
                                        <div className='my-5'>
                                            {isLoading ? <TextLoading /> :
                                                <>
                                                    <div className='flex items-end justify-center mb-10'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />{pricingPlan.monthly}</div><span className='font-semibold'>/month</span></div>
                                                    {!hasSubscribed &&
                                                        <div className='flex justify-center'><Button radius="none" size="lg" color="primary" variant="bordered" onClick={() => onSelectAdPrice("Monthly", pricingPlan.monthly)}>Choose Monthly Plan</Button></div>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </Tab>
                                    <Tab key="yearly" title="Yearly">
                                        <div className='my-5'>
                                            {isLoading ? <TextLoading /> :
                                                <>
                                                    <div className='flex items-end justify-center text-md mb-5'>
                                                        <div className='flex items-center line-through decoration-slate-500/60'><IndianRupee size={15} />{pricingPlan.monthly * 12}</div><span className='text-xs'>/year</span>
                                                        <div className='ml-2 bg-color1d/10 rounded-full px-5'>Save {calculateDiscountPercentage(pricingPlan.monthly * 12, pricingPlan.yearly)}%</div>
                                                    </div>
                                                    <div className='flex items-end justify-center mb-10'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />{pricingPlan.yearly}</div><span className='font-semibold'>/year</span></div>
                                                    {!hasSubscribed &&
                                                        <div className='flex justify-center'><Button radius="none" size="lg" color="primary" variant="bordered" onClick={() => onSelectAdPrice("Yearly", pricingPlan.yearly)}>Choose Yearly Plan</Button></div>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 lg:mx-0 relative'>
                <PaymentCard
                    pricing={adPrice}
                    expiryDate={expiryDate}
                    paymentData={paymentData}
                    hasSubscribed={hasSubscribed}
                    setHasSubscribed={setHasSubscribed}
                    isOfferApplicable={false}
                    endpoint={Products.advertisement.api.base} />
            </div>
            <div className='col-span-full lg:col-start-3 lg:col-span-5 mt-3 lg:mt-0 mb-8 mx-2 lg:mx-0'>
                <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                    <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onClick={() => router.push(`/dashboard/advertise/upload-images?type=edit_back&source=${source}`)}>
                        Back
                    </Button>
                    <Button className='btn-primary text-base' color='primary' isDisabled={!hasSubscribed} isLoading={isSubmitLoading} onClick={onClickSave}>
                        Continue to Preview
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Page