"use client"
import PriceLoading from '@/app/loading-components/price-loading'
import TextLoading from '@/app/loading-components/text-loading'
import Breadcrumb from '@/app/sub-components/breadcrumb'
import { getPublicApiResponse } from '@/lib/apiLibrary'
import { CalculateDiscountPercentage } from '@/lib/helpers'
import { Products, Resource } from '@/public/shared/app.config'
import { Button } from "@heroui/react"
import { IndianRupee } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const router = useRouter();
    const [adPricing, setAdPricing] = useState(null);
    const [bizPricing, setBizPricing] = useState(null);
    const [propertyPricing, setPropertyPricing] = useState<any>(null);
    const fetchAdPricing = async () => {
        const res = await getPublicApiResponse(`${Products.advertisementPricingPlan.api.base}`);
        const data = res.data;
        setAdPricing(data);
    }
    // const fetchBizPricing = async () => {
    //     const res = await getPublicApiResponse(`${Products.businessListingPricingPlan.api.base}`);
    //     const data = res.data;
    //     setBizPricing(data);
    // }
    // const fetchPropertyPricing = async () => {
    //     const res = await getPublicApiResponse(`${Products.realEstatePricingPlan.api.base}?populate=Rent,Sale,PG`);
    //     const data = res.data;
    //     setPropertyPricing(data);
    // }
    useEffect(() => {
        fetchAdPricing();
        // fetchBizPricing();
        // fetchPropertyPricing();
    }, [])
    const onClickGetStarted = (link: string) => {
        router.push(`${link}?type=new`)
    }

    return (
        <>
            <div className='max-w-screen-xl min-h-screen mx-auto px-3'>
                <div className='my-5'><Breadcrumb /></div>
                <div className='my-10 md:my-16'>
                    <div className='text-center mb-16'>
                        <h1 className="text-2xl md:text-4xl font-semibold text-slate-600">Pricing plans</h1>
                        <p className='my-5 text-sm md:text-xl font-light'>Simple & Transparent Pricing for all the business.</p>
                    </div>

                    {/* Advertisemnt Listing Pricing */}
                    <div className='grid grid-cols-1 md:grid-cols-6 bg-color1d/10 rounded-xl gap-8 p-8 pb-14 content-center mb-20'>
                        <div className='col-span-full p-5 text-2xl font-medium place-self-center'>Advertisement Listing</div>
                        <div className='col-span-full md:col-start-2 md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Monthly Subscription</h2>
                                <div className='text-xs'>Pay on monthly basis as per your flexibility.</div>
                                {!!adPricing ?
                                    <div className='flex items-center mt-10 tracking-tight'>
                                        <IndianRupee strokeWidth={3} size={28} />
                                        <span className='text-4xl font-semibold'>{adPricing["monthly"]}</span>
                                        <span className='self-end ml-1 text-xs'>per month</span>
                                    </div> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.Advertisement.addDetailsLink)} isDisabled={!adPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Quaterly Subscription</h2>
                                <div className='text-xs'>Pay quaterly to avail extra discount.</div>
                                {!!adPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{adPricing["monthly"] * 3}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(adPricing["monthly"] * 3, adPricing["quaterly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{adPricing["quaterly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per 3 months</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.Advertisement.addDetailsLink)} isDisabled={!adPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-start-2 md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Half Yearly Subscription</h2>
                                <div className='text-xs'>Pay half yearly to avail extra discount.</div>
                                {!!adPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{adPricing["monthly"] * 6}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(adPricing["monthly"] * 6, adPricing["halfyearly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{adPricing["halfyearly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per 6 months</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.Advertisement.addDetailsLink)} isDisabled={!adPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Yearly Subscription</h2>
                                <div className='text-xs'>Pay yearly to avail extra discount.</div>
                                {!!adPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{adPricing["monthly"] * 12}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(adPricing["monthly"] * 12, adPricing["yearly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{adPricing["yearly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per year</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.Advertisement.addDetailsLink)} isDisabled={!adPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 bg-color1d/10 rounded-xl *:border *:border-transparent * *:rounded-xl gap-8 p-8 pb-14 md:pb-8 pb-14 content-center mb-20'>
                        {/* Business Listing Pricing */}
                        <div className='col-span-full md:col-span-1 *:border *:border-transparent * *:rounded-xl'>
                            <div className='p-5 text-2xl font-medium place-self-center'>Business Listing</div>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Free Subscription</h2>
                                <div className='text-xs'>Boost Your Local Presence — List Your Business for Free Today.</div>
                                <div className='flex items-center mt-6 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>0</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div>
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.BusinessListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        {/* Classified Listing Pricing */}
                        <div className='col-span-full md:col-span-1 *:border *:border-transparent * *:rounded-xl'>
                            <div className='p-5 text-2xl font-medium place-self-center'>Classified Listing</div>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Free Subscription</h2>
                                <div className='text-xs'>List your items in resale market for free.</div>
                                <div className='flex items-center mt-10 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>0</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div>
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.ClassifiedListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        {/* Job Listing Pricing */}
                        <div className='col-span-full md:col-span-1 *:border *:border-transparent * *:rounded-xl'>
                            <div className='p-5 text-2xl font-medium place-self-center'>Job Listing</div>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Free Subscription</h2>
                                <div className='text-xs'>List your job with detailed requirements.</div>
                                <div className='flex items-center mt-10 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>0</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div>
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.JobListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property Listing Pricing */}
                    <div className='grid grid-cols-1 md:grid-cols-3 bg-color1d/10 rounded-xl *:border *:border-transparent * *:rounded-xl gap-8 p-8 pb-14 md:pb-8 pb-14 content-center mb-20'>
                        <div className='col-span-full p-5 text-2xl font-medium place-self-center'>Property Listing - (<span className=''>Free Subscription</span>)</div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                            <h2 className='font-semibold mb-1'>For Rent</h2>
                            <div className='text-xs'>List your proprty for rent.</div>
                            <div className='flex items-center mt-10 tracking-tight'>
                                <IndianRupee strokeWidth={3} size={28} />
                                <span className='text-4xl font-semibold'>0</span>
                                <span className='self-end ml-1 text-xs'>per month</span>
                            </div>
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                            <h2 className='font-semibold mb-1'>For Sale</h2>
                            <div className='text-xs'>List your proprty for sale.</div>
                            <div className='flex items-center mt-10 tracking-tight'>
                                <IndianRupee strokeWidth={3} size={28} />
                                <span className='text-4xl font-semibold'>0</span>
                                <span className='self-end ml-1 text-xs'>per month</span>
                            </div>
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d h-fit'>
                            <h2 className='font-semibold mb-1'>Paying Guest</h2>
                            <div className='text-xs'>List your proprty as PG.</div>
                            <div className='flex items-center mt-10 tracking-tight'>
                                <IndianRupee strokeWidth={3} size={28} />
                                <span className='text-4xl font-semibold'>0</span>
                                <span className='self-end ml-1 text-xs'>per month</span>
                            </div>
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                    </div>

                    {/* Property Listing Pricing */}
                    {/* <div className='grid grid-cols-1 md:grid-cols-3 bg-color1d/10 rounded-xl *:border *:border-transparent * *:rounded-xl gap-8 p-8 pb-14 md:pb-8 pb-14 content-center mb-20'>
                        <div className='col-span-full p-5 text-2xl font-medium place-self-center'>Property Listing - (<span className=''>Monthly Subscription Only</span>)</div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                            <h2 className='font-semibold mb-1'>For Rent</h2>
                            <div className='text-xs'>Plan is based on type of room configuration listed below.</div>
                            <table className="table-auto w-full mt-5">
                                <thead className='text-left'>
                                    <tr className='*:!font-semibold *:text-sm *:p-2 text-slate-600 bg-color1d/10'>
                                        <th>Type</th>
                                        <th>Pricing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!!propertyPricing ? propertyPricing["Rent"].map((row: any, i: any) => (
                                        <tr key={i} className="hover:bg-gray-50 *:p-2 border-b border-slate-100 text-slate-500">
                                            <td>{row.type}</td>
                                            <td className='font-medium flex items-center'><IndianRupee strokeWidth={2} size={15} />{row.amount}</td>
                                        </tr>
                                    )) :
                                        <>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                        </>
                                    }
                                </tbody>
                            </table>
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} isDisabled={!propertyPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                            <h2 className='font-semibold mb-1'>For Sale</h2>
                            <div className='text-xs'>Plan is based on type of room configuration listed below.</div>
                            <table className="table-auto w-full mt-5">
                                <thead className='text-left'>
                                    <tr className='*:!font-semibold *:text-sm *:p-2 text-slate-600 bg-color1d/10'>
                                        <th>Type</th>
                                        <th>Pricing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!!propertyPricing ? propertyPricing["Sale"].map((row: any, i: any) => (
                                        <tr key={i} className="hover:bg-gray-50 *:p-2 border-b border-slate-100 text-slate-500">
                                            <td>{row.type}</td>
                                            <td className='font-medium flex items-center'><IndianRupee strokeWidth={2} size={15} />{row.amount}</td>
                                        </tr>
                                    )) :
                                        <>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                            <tr className='*:p-2 border-b border-slate-100 text-slate-500'>
                                                <td><TextLoading /></td>
                                                <td><TextLoading /></td>
                                            </tr>
                                        </>
                                    }
                                </tbody>
                            </table>
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} isDisabled={!propertyPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                        <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d h-fit'>
                            <h2 className='font-semibold mb-1'>Paying Guest</h2>
                            <div className='text-xs'>Pay on monthly basis as per your flexibility.</div>
                            {!!propertyPricing ?
                                <div className='flex items-center mt-10 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>{propertyPricing["PG"][0].amount}</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div> :
                                <div className='mt-10'><PriceLoading /></div>
                            }
                            <div className='h-full flex items-end mt-8'>
                                <Button onPress={() => onClickGetStarted(Resource.PropertyListing.addDetailsLink)} isDisabled={!propertyPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                            </div>
                        </div>
                    </div> */}

                    {/* Business Listing Pricing */}
                    {/* <div className='grid grid-cols-1 md:grid-cols-6 bg-color1d/10 rounded-xl gap-8 p-8 pb-14 content-center mb-20'>
                        <div className='col-span-full p-5 text-2xl font-medium place-self-center'>Business Listing</div>
                        <div className='col-span-full md:col-start-2 md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Monthly Subscription</h2>
                                <div className='text-xs'>Pay on monthly basis as per your flexibility.</div>
                                {!!bizPricing ?
                                    <div className='flex items-center mt-10 tracking-tight'>
                                        <IndianRupee strokeWidth={3} size={28} />
                                        <span className='text-4xl font-semibold'>{bizPricing["monthly"]}</span>
                                        <span className='self-end ml-1 text-xs'>per month</span>
                                    </div> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.BusinessListing.addDetailsLink)} isDisabled={!bizPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Quaterly Subscription</h2>
                                <div className='text-xs'>Pay quaterly to avail extra discount.</div>
                                {!!bizPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{bizPricing["monthly"] * 3}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(bizPricing["monthly"] * 3, bizPricing["quaterly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{bizPricing["quaterly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per 3 months</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.BusinessListing.addDetailsLink)} isDisabled={!bizPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-start-2 md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Half Yearly Subscription</h2>
                                <div className='text-xs'>Pay half yearly to avail extra discount.</div>
                                {!!bizPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{bizPricing["monthly"] * 6}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(bizPricing["monthly"] * 6, bizPricing["halfyearly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{bizPricing["halfyearly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per 6 months</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.BusinessListing.addDetailsLink)} isDisabled={!bizPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-full md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Yearly Subscription</h2>
                                <div className='text-xs'>Pay yearly to avail extra discount.</div>
                                {!!bizPricing ?
                                    <>
                                        <div className='my-3 flex items-center'>
                                            <div className='line-through text-base flex items-center'><IndianRupee strokeWidth={2} size={15} />{bizPricing["monthly"] * 12}</div>
                                            <div className='ml-2 bg-color1d/10 rounded-full px-5 w-fit text-sm'>Save {CalculateDiscountPercentage(bizPricing["monthly"] * 12, bizPricing["yearly"])}%</div>
                                        </div>
                                        <div className='flex items-center tracking-tight'>
                                            <IndianRupee strokeWidth={3} size={28} />
                                            <span className='text-4xl font-semibold'>{bizPricing["yearly"]}</span>
                                            <span className='self-end ml-1 text-xs'>per year</span>
                                        </div>
                                    </> :
                                    <div className='mt-10'><PriceLoading /></div>
                                }
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.BusinessListing.addDetailsLink)} isDisabled={!bizPricing} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* <div className='grid grid-cols-1 md:grid-cols-6 bg-color1d/10 rounded-xl gap-8 p-8 pb-14 content-center mb-20'>
                        Classified Listing Pricing
                        <div className='col-span-full md:col-start-2 md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='p-5 text-2xl font-medium place-self-center'>Classified Listing</div>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Free Subscription</h2>
                                <div className='text-xs'>List your items in resale market for free.</div>
                                <div className='flex items-center mt-10 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>0</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div>
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.ClassifiedListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                        Job Listing Pricing
                        <div className='col-span-full md:col-span-2 *:border *:border-transparent * *:rounded-xl'>
                            <div className='p-5 text-2xl font-medium place-self-center'>Job Listing</div>
                            <div className='flex flex-col pricing-card bg-white p-5 hover:border-color1d'>
                                <h2 className='font-semibold mb-1'>Free Subscription</h2>
                                <div className='text-xs'>List your job with detailed requirements.</div>
                                <div className='flex items-center mt-10 tracking-tight'>
                                    <IndianRupee strokeWidth={3} size={28} />
                                    <span className='text-4xl font-semibold'>0</span>
                                    <span className='self-end ml-1 text-xs'>per month</span>
                                </div>
                                <div className='h-full flex items-end mt-8'>
                                    <Button onPress={() => onClickGetStarted(Resource.JobListing.addDetailsLink)} variant='solid' radius='sm' color='primary' className='w-full' size='sm'>Get Started</Button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Page