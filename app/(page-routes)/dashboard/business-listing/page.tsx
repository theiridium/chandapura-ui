"use client"
import { getPublicApiResponse } from '@/lib/interceptor';
import { DropdownList, Resource } from '@/public/shared/app.config';
import { Button, Link } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
  // const searchParams = useSearchParams();
  // const source = searchParams.get('source');
  const attr = DropdownList.BusinessList.api;
  const { data }: any = useSession();
  const user = data?.user;
  const [list, setList] = useState<any>([]);
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
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    getBusinessList();
    console.log(list)
  }, [isLoading])

  return (
    <div className='max-w-screen-xl mx-auto px-3 my-8 md:mt-8 md:mb-10'>
      <h1 className="text-3xl font-bold text-gray-600 mb-8 md:mb-12">My Business</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-5'>
        {!isLoading && list.map((x: any, i: any) =>
          // <a href={Resource.BusinessListing.userLink + '?source=' + x.id} key={i}>{x.name}</a>
          <div key={i} className='border rounded-lg'>
            <div className='p-5 md:p-8'>
              <div className="flex gap-5 md:gap-10">
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
                    <div className='hidden md:flex gap-5 '>
                      <Button size="md" radius='sm' as={Link} href={Resource.BusinessListing.userLink + '?type=edit&source=' + x.id}>Edit Business Profile</Button>
                      <Button size="md" radius='sm' as={Link} href={Resource.BusinessListing.userLink + '?type=edit&source=' + x.id}>Edit Images</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex gap-5 md:hidden mt-5'>
                <Button size="md" radius='sm' as={Link} href={Resource.BusinessListing.userLink + '?type=edit&source=' + x.id}>Edit Business Profile</Button>
                <Button size="md" radius='sm' as={Link} href={Resource.BusinessListing.userLink + '?type=edit&source=' + x.id}>Edit Images</Button>
              </div>
            </div>
            <a href='#' className='bg-color1d/90 hover:bg-color1d text-white block px-5 py-2 text-center border rounded-b-lg'>Advertise Now</a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page