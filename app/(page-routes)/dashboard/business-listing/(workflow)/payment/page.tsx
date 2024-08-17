"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Button, Input, Tab, Tabs } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormSubmitLoading from '@/app/loading-components/form-submit-loading';
import { Products } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import PaymentCard from '@/app/sub-components/payment-card';

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
    const [listingPrice, setListingPrice] = useState<any>({
        type: "Monthly",
        amount: 0
    });
    const [adPrice, setAdPrice] = useState<any>({
        type: "Monthly",
        amount: 0
    });

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.business.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate[0]=category&populate[1]=sub_category`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    setApiRes(data);
                    setListingPrice({ ...listingPrice, amount: data.sub_category.pricing });
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
            else if (type === "new" || type === "edit_back") {
                let payload = {
                    step_number: 4
                }
                const endpoint = Products.business.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Payment details saved successfully!");
                    router.push(`/dashboard/business-listing/publish?type=${type}&source=${response.data.id}`)
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
            {isSubmitLoading && <FormSubmitLoading text={"Saving your payment details..."} />}
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
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Pricing Plan</div>
                        {/* {isLoading ? <TextLoading /> : <p className='bg-green-200 px-6 py-1 rounded-full w-fit-content text-lg'>
                            Yay! Your business category is eligible for free listing. 🎉
                        </p>} */}
                        <div className='bg-color1d/10 rounded-lg p-8'>
                            <div className='w-full'>
                                <Tabs fullWidth color='secondary' radius='full' size='lg' aria-label="Pricing Tabs"
                                    classNames={{
                                        tabList: "bg-color2d/40 p-0",
                                        tabContent: "text-black",
                                    }}
                                    disabledKeys={["yearly"]}>
                                    <Tab key="monthly" title="Monthly">
                                        <div className='my-5'>
                                            <div className='flex items-end justify-center'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />{listingPrice.amount}</div><span className='font-semibold'>/month</span></div>
                                        </div>
                                    </Tab>
                                    <Tab key="yearly" title="Yearly" />
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <Accordion className='listing-card border rounded-lg px-7 py-6'
                        itemClasses={{
                            title: "card-header text-xl font-semibold px-0"
                        }}>
                        <AccordionItem key="1" aria-label="Advertise Business" title="Would you like to advertise your business?">
                            <div>
                                <div className='mb-5'>Choose a Pricing Plan</div>
                                <Tabs fullWidth color='secondary' radius='full' size='lg' aria-label="Pricing Tabs"
                                    classNames={{
                                        tabList: "bg-color2d/40 p-0",
                                        tabContent: "text-black",
                                        tab: "z-10"
                                    }}>
                                    <Tab key="monthly" title="Monthly">
                                        <div className='my-5'>
                                            <div className='flex items-end justify-center mb-10'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />299</div><span className='font-semibold'>/month</span></div>
                                            <div className='flex justify-center'><Button radius="none" size="lg" color="primary" variant="bordered" onClick={() => onSelectAdPrice("Monthly", 299)}>Choose Monthly Plan</Button></div>
                                        </div>
                                    </Tab>
                                    <Tab key="yearly" title="Yearly">
                                        <div className='my-5'>
                                            <div className='flex items-end justify-center text-md mb-5'>
                                                <div className='flex items-center line-through decoration-slate-500/60'><IndianRupee size={15} />3588</div><span className='text-xs'>/year</span>
                                                <div className='ml-2 bg-color1d/10 rounded-full px-5'>Save 20%</div>
                                            </div>
                                            <div className='flex items-end justify-center mb-10'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />2870</div><span className='font-semibold'>/year</span></div>
                                            <div className='flex justify-center'><Button radius="none" size="lg" color="primary" variant="bordered" onClick={() => onSelectAdPrice("Yearly", 2870)}>Choose Yearly Plan</Button></div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <div className='col-span-full lg:col-span-3 mt-3 lg:my-8 mx-2 lg:mx-0 relative'>
                <PaymentCard adPrice={adPrice} listingPrice={listingPrice} setAdPrice={setAdPrice} />
            </div>
            <div className='col-span-full lg:col-start-3 lg:col-span-5 mt-3 lg:mt-0 mb-8 mx-2 lg:mx-0'>
                <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                    <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onClick={() => router.push(`/dashboard/business-listing/upload-images?type=edit_back&source=${source}`)}>
                        Back
                    </Button>
                    <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading} onClick={onClickSave}>
                        Continue to Preview
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Page