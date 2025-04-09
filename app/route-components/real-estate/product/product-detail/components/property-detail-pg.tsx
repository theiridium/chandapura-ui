import ViewLocationMap from '@/app/components/maps/view-location-map'
import Breadcrumb from '@/app/sub-components/breadcrumb'
import ContactButton from '@/app/sub-components/contact-btn'
import { ConvertCurrencyToWords } from '@/lib/helpers'
import { SelectList } from '@/public/shared/app.config'
import { IndianRupee } from 'lucide-react'
import React from 'react'

const PropertyDetailPG = ({ data, onOpen, property_details }: any) => {
    return (
        <div className="lg:col-span-3">
            <div className="lg:border border-gray-300 rounded-xl bg-white lg:p-7 gap-x-5 lg:gap-x-7">
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
                        <div className="lg:hidden"><Breadcrumb /></div>
                        <div>
                            <h1 className="md:text-xl font-medium text-gray-500 mb-5">{data.property_type} in {data.area.name}</h1>
                            <h2 className="font-semibold text-xl lg:text-3xl mb-2 lg:mb-0">{data.name}</h2>
                        </div>
                    </div>
                    <div className='mb-12 pt-5'>
                        <div>
                            <div className='text-sm text-gray-500 font-semibold'>Address</div>
                            <p className='text-sm md:text-lg font-medium'>{data.full_address}</p>
                        </div>
                        {property_details.landmark && <div className='mt-5'>
                            <div className='text-sm text-gray-500 font-semibold'>Landmark</div>
                            <p className='text-sm md:text-lg font-medium'>{property_details.landmark}</p>
                        </div>}
                    </div>
                    <div className='mb-12'>
                        <ContactButton name={data.contact.contact_name} phone={data.contact.contact_number} maskedText={"Owner"} />
                    </div>
                    <hr className='mb-12' />
                    <div className='mb-12'>
                        <h5 className='text-sm text-gray-500 font-semibold mb-5'>Amenities</h5>
                        <div className="tags">
                            {property_details.amenities.map((x: any, i: any) =>
                                <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.name}</div>
                            )}
                        </div>
                    </div>
                    <hr className='mb-12' />
                    <div className='mb-12'>
                        <div className='text-sm text-gray-500 font-semibold mb-5'>Occupancy Based Rent Per Month</div>
                        <div className='grid grid-cols-2 md:grid-cols-4 content-center gap-y-5 md:gap-y-0 gap-x-5'>
                            {SelectList.OccupancyType.map((x: any, i: any) =>
                                <div key={i} className={`p-5 border border-color1d/30 col-span-auto w-full h-full rounded-xl flex flex-col items-center justify-center
                                                         ${!!property_details?.occupancy_type?.[x.name]?.toString() && property_details?.occupancy_type?.[x.name] > 0 && ' bg-color1d/30'}`}>
                                    <div>{x.label}</div>
                                    <div>{(property_details?.occupancy_type?.[x.name] && (`₹ ${ConvertCurrencyToWords(property_details?.occupancy_type?.[x.name])}`)) || "Not Available"}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className='mb-12' />
                    <div className='mb-12'>
                        <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                        {/* <Map /> */}
                        <ViewLocationMap coordinates={data.location.coordinates} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetailPG