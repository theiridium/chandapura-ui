"use client"
import ButtonListModal from '@/app/components/modals/button-list-modal';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { DropdownList, Resource } from '@/public/shared/app.config';
import { Button, Link, useDisclosure } from '@nextui-org/react';
import { MoveRight, Plus } from 'lucide-react';
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
  // const searchParams = useSearchParams();
  // const source = searchParams.get('source');
  const addNewUrl = "/business-listing/add-details?type=new";
  const router = useRouter();
  const attr = DropdownList.BusinessList.api;
  const { data }: any = useSession();
  const user = data?.user;
  const [list, setList] = useState<any>([]);
  const [btnForModal, setBtnForModal] = useState<any>();
  // const [name, setName] = useState<any>("Add New");
  const [isLoading, setIsLoading] = useState(true);
  const getBusinessList = async () => {
    let apiUrlContact = `${attr.base}?sort=${attr.sort}&${attr.filter}=${user?.email}&populate=featured_image`
    const response = await getPublicApiResponse(apiUrlContact);
    // const filteredData = response.data.filter((x: any) => x.id.toString() === source)[0];
    setList(response.data);
    // console.log(response)
    // (filteredData && source) && setName(filteredData.name)
    setIsLoading(false);
  }
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    getBusinessList();
  }, [isLoading])

  const EditButtons = ({ item }: any) => {
    return <>
      <Button size="md" color='secondary' radius='sm' as={Link} href={Resource.BusinessListing.addDetailsLink + '?type=edit&source=' + item.id}>Edit Business Profile</Button>
      <Button size="md" color='secondary' radius='sm' as={Link} href={Resource.BusinessListing.uploadImagesLink + '?type=edit&source=' + item.id}>Edit Images</Button>
    </>
  }

  const onClickEditListing = (item: any) => {
    setBtnForModal(<EditButtons item={item} />);
    onOpen();
  }

  return (
    <div className='max-w-screen-xl min-h-screen mx-auto px-3 my-8 md:mt-8 md:mb-10'>
      <div className='flex gap-8 justify-between md:justify-normal'>
        <h1 className="text-3xl font-bold text-gray-600 mb-8 md:mb-12">My Business</h1>
        <Button color="primary" variant="ghost" radius="sm" className='hover:color-white'
          onClick={() => router.push(addNewUrl)}
          startContent={<Plus size={20} />}>
          Add New
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-5'>
        {isLoading ? <>Loading..</> :
          list.length > 0 ?
            !isLoading && list.map((x: any, i: any) => {
              let continueUrl = "";
              if (!x.publish_status) {
                let baseUrl = steps.find(({ number }) => number === x.step_number)?.currentPath;
                continueUrl = `${Resource.BusinessListing.baseLink}/${baseUrl}?type=new&source=${x.id}`
              }
              return (
                // <a href={Resource.BusinessListing.userLink + '?source=' + x.id} key={i}>{x.name}</a>
                <div key={i} className='border rounded-lg'>
                  <div className='p-5 pt-7 md:p-8'>
                    <div className="flex gap-5 md:gap-10 relative">
                      <div className='absolute -top-5 md:-top-5 -right-3 md:-right-5'>
                        {x.publish_status ? <div className='border rounded-full text-xs md:text-sm px-3 border-emerald-500 text-emerald-500 font-medium'>Published</div> :
                          <div className='border rounded-full text-xs md:text-sm px-3 border-sky-500 text-sky-500 font-medium'>Draft</div>}
                      </div>
                      <div className='aspect-square h-[120px]'>
                        {x.featured_image === null ?
                          <img src="/images/placeholder.png" className="w-full h-full rounded-lg" /> :
                          <img src={x.featured_image.url} className="w-full h-full rounded-lg" />}
                      </div>
                      <div className='w-full grow'>
                        <div className='grid grid-cols-1 h-full content-between'>
                          <div>
                            <div className='font-semibold text-xl md:text-2xl mb-1'>{x.name}</div>
                            <div className='text-sm'>{x.area}</div>
                          </div>
                          {x.publish_status ?
                            <>
                              <div className='hidden md:flex gap-5 '>
                                <EditButtons item={x} />
                              </div>
                              <div className='flex md:hidden gap-5 '>
                                <Button color='secondary' size="md" radius='sm' onPress={() => onClickEditListing(x)}>Edit Listing</Button>
                              </div>
                            </> :
                            <div className='flex'>
                              <Button endContent={<MoveRight />} size="md" color='secondary' radius='sm' as={Link}
                                href={continueUrl}>
                                Continue<span className='hidden md:block -ml-1'>to complete listing</span>
                              </Button>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href='#' className='bg-color1d/90 hover:bg-color1d text-white block px-5 py-2 text-center border rounded-b-lg'>Advertise Now</a>
                </div>)
            }) :
            <p className='text-lg'>Your list is empty, click on <a className='link-text' href={addNewUrl}>Add New</a> to start listing your Business today.</p>}
      </div>
      <ButtonListModal isOpen={isOpen} onOpenChange={onOpenChange} btnComp={btnForModal} />
    </div>
  )
}

export default Page