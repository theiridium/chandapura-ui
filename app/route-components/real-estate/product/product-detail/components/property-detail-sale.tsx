import ViewLocationMap from '@/app/components/maps/view-location-map'
import Breadcrumb from '@/app/sub-components/breadcrumb'
import ContactButton from '@/app/sub-components/contact-btn'
import { ConvertCurrencyToWords } from '@/lib/helpers'
import { IndianRupee } from 'lucide-react'
import React from 'react'

const PropertyDetailSale = ({ data, onOpen, property_details }: any) => {
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
                            <h1 className="md:text-xl font-medium text-gray-500 mb-5">{property_details.room_type} {data.property_type} {data.listing_type !== "PG" && <span className='text-highlight'>for {data.listing_type}</span>} in {data.area.name}</h1>
                            <h2 className="font-semibold text-xl lg:text-3xl mb-2 lg:mb-0">{data.name}</h2>
                        </div>
                        {data.listing_type !== "PG" &&
                            <div className='text-2xl font-semibold text-gray-600 flex items-center bg-color2d/70 px-5 py-1 mt-0 lg:mt-5 lg:mt-0 w-fit float-right lg:float-none'><IndianRupee strokeWidth={3} size={20} />{ConvertCurrencyToWords(property_details.selling_amount)}</div>
                        }
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
                    <div className='flex lg:flex-none flex-wrap lg:grid lg:grid-flow-col lg:justify-stretch gap-x-10 lg:gap-x-5 mb-12'>
                        <div className='mb-5 lg:mb-0'>
                            <div className='text-sm text-gray-500 font-semibold'>Type</div>
                            <div className='text-sm md:text-lg font-medium'>{data.property_type}</div>
                        </div>
                        <div className='mb-5 lg:mb-0'>
                            <div className='text-sm text-gray-500 font-semibold'>Availability</div>
                            <div className='text-sm md:text-lg font-medium'>Immediate</div>
                        </div>
                        <div className='mb-5 lg:mb-0'>
                            <div className='text-sm text-gray-500 font-semibold'>Rooms</div>
                            <div className='text-sm md:text-lg font-medium'>{data.room_type}</div>
                        </div>
                        <div className='mb-5 lg:mb-0'>
                            <div className='text-sm text-gray-500 font-semibold'>Direction</div>
                            <div className='text-sm md:text-lg font-medium'>{property_details.facing} Facing</div>
                        </div>
                        <div className='mb-5 lg:mb-0'>
                            <div className='text-sm text-gray-500 font-semibold'>Furnishing</div>
                            <div className='text-sm md:text-lg font-medium'>{property_details.furnishing}</div>
                        </div>
                    </div>
                    <hr className='mb-12' />
                    <div className='flex lg:flex-none flex-nowrap lg:grid lg:grid-cols-5 gap-x-5 lg:gap-x-10 mb-12 overflow-x-auto'>
                        <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                            <img className='max-w-[64px]' src='/images/icons/area.png' />
                            <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{property_details.carpet_area} Sqft</div>
                        </div>
                        <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                            <img className='max-w-[64px]' src='/images/icons/bathroom.png' />
                            <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{property_details.bathrooms} Baths</div>
                        </div>
                        <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                            <img className='max-w-[64px]' src='/images/icons/floor.png' />
                            <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>
                                {property_details.floor_number} Floor
                            </div>
                        </div>
                        <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                            <img className='max-w-[64px]' src='/images/icons/balcony.png' />
                            <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>1 Balcony</div>
                        </div>
                        <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                            <img className='max-w-[64px]' src='/images/icons/parking.png' />
                            <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{property_details.parking_type} Parking</div>
                        </div>
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
                        <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                        {/* <Map /> */}
                        <ViewLocationMap coordinates={data.location.coordinates} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyDetailSale