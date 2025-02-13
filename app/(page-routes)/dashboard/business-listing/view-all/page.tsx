"use client"
import FormLoading from '@/app/loading-components/form-loading';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { GetDaysToExpire } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';
import { DropdownList, Resource } from '@/public/shared/app.config';
import { Button } from '@nextui-org/react';
import { Clock3, MapPin, MoveRight, Pencil, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const steps = [
  {
    number: 1,
    title: "Business Details",
    currentPath: "add-details",
    nextPath: "upload-images"
  },
  {
    number: 2,
    title: "Upload Images",
    currentPath: "upload-images",
    nextPath: "payment"
  },
  {
    number: 3,
    title: "Payment",
    currentPath: "payment",
    nextPath: "publish"
  },
  {
    number: 4,
    title: "Review & Publish",
    currentPath: "publish",
    nextPath: "completed"
  }
]
const Page = () => {
  const addNewUrl = "/dashboard/business-listing/add-details?type=new";
  const router = useRouter();
  const attr = DropdownList.BusinessList.api;
  const { data }: any = useSession();
  const user = data?.user;
  const [list, setList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const getBusinessList = async () => {
    let apiUrl = `${attr.base}?sort=${attr.sortByDate}&${attr.filter}=${user?.email}&populate=featured_image,payment_details,area`
    const response = await getPublicApiResponse(apiUrl);
    setList(response.data);
    setIsLoading(false);
  }
  useEffect(() => {
    getBusinessList();
  }, [])

  return (
    <div className='max-w-screen-xl min-h-screen mx-auto px-3 my-8 md:mt-8 md:mb-10'>
      <div className='flex gap-8 justify-between md:justify-normal'>
        <h1 className="text-3xl font-semibold md:font-bold text-gray-600 mb-8 md:mb-12">My Business</h1>
        <Button color="primary" variant="ghost" radius="sm" className='hover:color-white'
          onPress={() => {
            setIsRedirecting(true);
            router.push(addNewUrl)
          }}
          startContent={<Plus size={20} />}>
          Add New
        </Button>
      </div>
      <Breadcrumb blockSecondLast={false} />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10'>
        {isLoading || isRedirecting ?
          (isLoading ? <FormLoading text={"Loading your Business List..."} /> :
            <FormLoading text={"Taking you to the Business Form page..."} />
          ) :
          list.length > 0 ?
            !isLoading && list.map((x: any, i: any) => {
              let continueUrl = "";
              if (!x.publish_status) {
                let baseUrl = steps.find(({ number }) => number === x.step_number)?.nextPath;
                continueUrl = `${Resource.BusinessListing.baseLink}/${baseUrl}?type=new&source=${x.id}`
              }
              const renewUrl = `${Resource.BusinessListing.baseLink}/payment?type=renew&source=${x.id}`;
              return (
                <div key={i} className={`py-10 md:px-5 border-b-1 md:border md:rounded-lg ${i === 0 && 'border-t-1'}`}>
                  <div className="flex gap-5 md:gap-10 relative">
                    <div className='absolute -top-6 right-0'>
                      {x.publish_status ?
                        <>
                          {x.payment_details && x.payment_details.expiry_date_timestamp <= new Date().getTime() ?
                            <div className='border rounded-full text-xs md:text-sm px-3 border-red-500 text-red-500 font-medium'>Expired</div> :
                            <div className='border rounded-full text-xs md:text-sm px-3 border-emerald-500 text-emerald-500 font-medium'>Active</div>}
                        </> :
                        <>
                          {(x.step_number === ListingWorkflow.Publish && !x.publish_status) ? <div className='border rounded-full text-xs md:text-sm px-3 border-amber-600 text-amber-600 font-medium'>Pending Approval</div> :
                            <div className='border rounded-full text-xs md:text-sm px-3 border-sky-500 text-sky-500 font-medium'>Draft</div>
                          }
                        </>}
                    </div>
                    <div className='flex *:basis-24 *:w-[145px] *:h-[150px] *:object-cover *:rounded-lg'>
                      {x.featured_image === null ?
                        <img src="/images/placeholder.png" /> :
                        <img src={x.featured_image.url} />}
                    </div>
                    <div className='w-full grow'>
                      <div className='grid grid-cols-1 h-full content-between'>
                        <div>
                          <div className='font-semibold md:text-2xl mb-1'>{x.name}</div>
                          <div className='text-xs mb-1 flex items-center'><MapPin size={10} className='mr-1' />{x.area.name}</div>
                          {!!x.payment_details?.subscription_type &&
                            <div className='text-sm font-medium text-gray-400 flex'>
                              {x.payment_details.subscription_type} Plan -
                              <span className={`ml-1 flex items-center ${GetDaysToExpire(x.payment_details.expiry_date) <= 10 && 'text-red-400'}`}>{GetDaysToExpire(x.payment_details.expiry_date)} days left<Clock3 className='ml-1' size={16} /></span>
                            </div>
                          }
                        </div>
                        {!x.advertise && <div className='flex'>
                          <Button className='w-full md:w-auto h-6' color='primary' variant='flat' size='sm'>Advertise Now</Button>
                        </div>}
                        <>
                          <div className='flex text-sm border-y-1 divide-x *:px-2 *:py-1 *:flex *:items-center *:grow *:justify-center *:gap-x-1 text-color1d'>
                            {x.publish_status ? <>
                              {(x.payment_details && x.payment_details.expiry_date_timestamp <= new Date().getTime()) ?
                                <a className='hover:bg-color2d/20' href={renewUrl}>Renew subscription<MoveRight size={15} /></a> :
                                <>
                                  <a className='hover:bg-color2d/20' href={Resource.BusinessListing.addDetailsLink + '?type=edit&source=' + x.id}>Biz Profile<Pencil size={15} /></a>
                                  <a className='hover:bg-color2d/20' href={Resource.BusinessListing.uploadImagesLink + '?type=edit&source=' + x.id}>Image<Pencil size={15} /></a>
                                </>
                              }
                            </> :
                              <>
                                {!x.publish_status && x.step_number === 4 ? <div>Pending Approval from Admin</div> : <a className='hover:bg-color2d/20' href={continueUrl}>Continue to complete listing<MoveRight size={15} /></a>}
                              </>
                            }
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </div>)
            }) :
            <p className='text-lg'>Your list is empty, click on <a className='link-text' href={addNewUrl}>Add New</a> to start listing your business today.</p>}
      </div>
    </div>
  )
}

export default Page