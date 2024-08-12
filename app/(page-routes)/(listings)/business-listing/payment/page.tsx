"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Accordion, AccordionItem, Button, Input, Tab, Tabs } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import FormSubmitLoading from '@/app/loading-components/form-submit-loading';
import { Products } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import TextLoading from '@/app/loading-components/text-loading';
import { IndianRupee } from 'lucide-react';

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

    const fetchData = async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.business.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate[0]=category&populate[1]=sub_category`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                console.log(data)
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
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {isSubmitLoading && <FormSubmitLoading text={"Publishing your Business..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10 mx-2'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Business Details</div>
                        {<div className='bg-color1d text-white rounded-lg p-8'>
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
                        </div>}
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
                                            <div className='flex items-end justify-center'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />99</div><span className='font-semibold'>/month</span></div>
                                        </div>
                                    </Tab>
                                    <Tab key="yearly" title="Yearly" />
                                </Tabs>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Promotional Discount</div>
                                    <p className='text-lg'><span className='underline underline-offset-8'>Free listing!</span> 🎉 (until 25th, December 2024)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Accordion className='listing-card border rounded-lg px-7 py-6'
                        itemClasses={{
                            // base: "px-0 w-full",
                            title: "card-header text-xl font-semibold px-0",
                            // trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
                            // indicator: "text-medium",
                            // content: "text-small px-2",
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
                                            <div className='flex items-end justify-center'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />299</div><span className='font-semibold'>/month</span></div>
                                        </div>
                                    </Tab>
                                    <Tab key="yearly" title="Yearly">
                                        <div className='my-5'>
                                            <div className='flex items-end justify-center text-md mb-5'>
                                                <div className='flex items-center line-through decoration-slate-500/60'><IndianRupee size={15} />3588</div><span className='text-xs'>/year</span>
                                                <div className='ml-2 bg-color1d/10 rounded-full px-5'>Save 20%</div>
                                            </div>
                                            <div className='flex items-end justify-center'><div className='text-5xl font-semibold flex items-center'><IndianRupee strokeWidth={3} size={30} />2870</div><span className='font-semibold'>/year</span></div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </AccordionItem>
                    </Accordion>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <Button className='btn-primary text-base' color='primary' isDisabled={isSubmitLoading} onClick={() => router.push(`/business-listing/upload-images?type=edit_back&source=${source}`)}>
                            Back
                        </Button>
                        <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading}>
                            Continue to Preview
                        </Button>
                    </div>
                </div>
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
        </>
    )
}

export default Page