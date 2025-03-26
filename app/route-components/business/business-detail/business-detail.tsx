'use client'
import ImageGallery from '@/app/components/modals/image-gallery';
import { useDisclosure } from "@heroui/react";
import { Phone } from 'lucide-react';
import ViewLocationMap from '@/app/components/maps/view-location-map';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import ContactButton from '@/app/sub-components/contact-btn';

const BusinessDetail = ({ data }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const all_images = [data.featured_image, ...(data.gallery_images ?? [])];
  return (
    <div>
      <ImageGallery isOpen={isOpen} onOpenChange={onOpenChange} list={all_images} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
        <div className="lg:col-span-3">
          <div className="lg:border border-gray-300 rounded-xl bg-white lg:p-7 gap-x-5 lg:gap-x-7">
            <div>
              <div className='grid lg:grid-rows-2 lg:grid-cols-7 gap-5 lg:gap-7 lg:mb-12 h-[250px] lg:h-[380px]'>
                <div className={`${data.gallery_images ? 'row-span-2 col-span-4 lg:col-span-5' : 'row-span-2 col-span-4 lg:col-span-full'}`}>
                  {data.featured_image &&
                    <div className='relative'>
                      <img src={data.featured_image.url} className="w-full h-[250px] lg:h-[380px] lg:rounded-xl object-cover" />
                      {data.gallery_images &&
                        <div className='absolute bottom-3 right-3 rounded-md bg-black/50 hover:bg-black/40 w-fit px-3 py-1 text-white cursor-pointer' onClick={onOpen}>{data.gallery_images.length + 1} Photos</div>
                      }
                    </div>
                  }
                </div>
                {data.gallery_images &&
                  <div className="hidden lg:block col-span-2">
                    <img src={data.gallery_images[0].url} className="w-full h-full rounded-xl object-cover" />
                  </div>
                }
                {data.gallery_images && data.gallery_images.length > 2 ?
                  <div className="hidden lg:block col-span-2 cursor-pointer relative" onClick={onOpen}>
                    <img src={data.gallery_images[1].url} className="w-full h-full rounded-xl object-cover" />
                    <div className="w-full h-full rounded-xl bg-black/50 hover:bg-black/40 absolute top-0 left-0 flex">
                      <span className='text-white text-[3.25rem] m-auto font-light'>+{data.gallery_images.length - 2}</span>
                    </div>
                  </div> :
                  <div className="hidden lg:block col-span-2">
                    {data.gallery_images && data.gallery_images[1] &&
                      <img src={data.gallery_images[1].url} className="w-full h-full rounded-xl object-cover" />
                    }
                  </div>
                }
              </div>
              <div className='p-5 lg:p-0'>
                <div className='re-header flex-none lg:flex justify-between mb-12'>
                  <div className="lg:hidden"><Breadcrumb blockSecondLast={true} /></div>
                  <div>
                    <h1 className="md:text-xl font-medium text-gray-500 mb-5"><span className='text-highlight'>{data.sub_category.name}</span> in {data.area.name}</h1>
                    <h2 className="font-semibold text-xl lg:text-3xl">{data.name}</h2>
                  </div>
                </div>
                <div className='mb-12'>
                  <div className='text-sm text-gray-500 font-semibold'>Address</div>
                  <p className='text-sm md:text-lg font-medium'>{data.full_address}</p>
                </div>
                <div className='mb-12'>
                  <ContactButton name={data.contact.contact_name} phone={data.contact.contact_number} openContact={true} />
                </div>
                <hr />
                {data.description &&
                  <>
                    <div className='py-12'>
                      <div className='text-sm text-gray-500 font-semibold'>Description</div>
                      <p className='text-sm md:text-lg font-medium'>{data.description}</p>
                    </div>
                    <hr />
                  </>}
                <div className='py-12'>
                  <div className='text-sm text-gray-500 font-semibold'>Timings</div>
                  <div className='time-table overflow-x-auto'>
                    <table className='table-fixed md:table-auto text-center divide-y w-full whitespace-nowrap'>
                      <thead>
                        <tr className='*:py-3'>
                          <th className='w-32 md:w-auto'></th>
                          <th className='w-32 md:w-auto'></th>
                          <th className='w-32 md:w-auto'>Opening Time</th>
                          <th className='w-24 md:w-auto'></th>
                          <th className='w-32 md:w-auto'>Closing Time</th>
                        </tr>
                      </thead>
                      <tbody className='text-sm md:text-lg font-medium divide-y'>
                        {data.bus_hours.map((x: any, i: any) =>
                          <tr className='*:py-3' key={i}>
                            <td className='text-left'>{x.day}</td>
                            <td><span className={`${x.isOpen ? 'bg-green-400' : 'bg-red-400'} text-white px-3 py-1 rounded-full`}>{x.isOpen ? "Open" : "Closed"}</span></td>
                            {x.isOpen &&
                              <>
                                <td>{x.open_time[0].toString()}</td>
                                <td>TO</td>
                                <td>{x.close_time[0].toString()}</td>
                              </>
                            }
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <hr />
                {(data.services || data.length > 0) &&
                  <>
                    <div className='py-12'>
                      <h5 className='text-sm text-gray-500 font-semibold mb-5'>Services</h5>
                      {data.services && <div className="tags">
                        {data.services.map((x: any, i: any) =>
                          <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.trim()}</div>
                        )}
                      </div>}
                    </div>
                    <hr />
                  </>}
                <div className='py-12'>
                  <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                  {/* <Map /> */}
                  <ViewLocationMap coordinates={data.location.coordinates} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='lg:col-span-1 relative'>
          <ContactCard heading="Owner Contact Details" name={data.contact_name} contact={data.contact_number} />
        </div> */}
      </div>
    </div>
  )
}

export default BusinessDetail