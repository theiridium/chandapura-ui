"use client"
import ContactButton from '@/app/sub-components/contact-btn';
import ContactCard from '@/app/sub-components/contact-card'
import { ConvertCurrencyToWords } from '@/lib/helpers';
import { IndianRupee } from 'lucide-react';
import React from 'react'
import ViewLocationMap from '@/app/components/maps/view-location-map';
import Breadcrumb from '@/app/sub-components/breadcrumb';

const ProductDetail = ({ data }: any) => {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
                <div className="lg:col-span-3">
                    <div className="lg:border border-gray-300 rounded-xl bg-white lg:p-7 gap-x-5 lg:gap-x-7">
                        <div className='grid lg:grid-rows-2 lg:grid-cols-7 gap-5 lg:gap-7 lg:mb-12'>
                            <div className="row-span-2 col-span-4 lg:col-span-5 *:w-full *:h-[250px] *:lg:h-[380px] *:lg:rounded-xl *:object-cover">
                                {data.featured_image === null ?
                                    <img src="/images/placeholder.png" /> :
                                    <img src={data.featured_image.url} />
                                }
                            </div>
                            <div className="hidden lg:block col-span-2 *:w-full *:h-full *:rounded-xl">
                                {data.featured_image === null ?
                                    <img src="/images/placeholder.png" /> :
                                    <img src={data.featured_image.url} />
                                }
                            </div>
                            <div className="hidden lg:block col-span-2 *:w-full *:h-full *:rounded-xl">
                                {data.featured_image === null ?
                                    <img src="/images/placeholder.png" /> :
                                    <img src={data.featured_image.url} />
                                }
                            </div>
                        </div>
                        <div className='p-5 lg:p-0'>
                            <div className='re-header flex-none lg:flex justify-between mb-12'>
                                <div className="lg:hidden"><Breadcrumb /></div>
                                <div>
                                    <h1 className="md:text-xl font-medium text-gray-500 mb-5">{data.room_type} {data.property_type} <span className='text-highlight'>for {data.listing_type}</span> in {data.area.name}</h1>
                                    <h2 className="font-semibold text-xl lg:text-3xl mb-2 lg:mb-0">{data.name}</h2>
                                </div>
                                <div className='text-2xl font-semibold text-gray-600 flex items-center bg-color2d/70 px-5 py-1 mt-0 lg:mt-5 lg:mt-0 w-fit float-right lg:float-none'><IndianRupee strokeWidth={3} size={20} />{data.listing_type === "Rent" ? ConvertCurrencyToWords(data.property_details.rental_amount) : ConvertCurrencyToWords(data.property_details.selling_amount)}</div>
                            </div>
                            <div className='mb-12 pt-5'>
                                <div className='mb-5'>
                                    <div className='text-sm text-gray-500 font-semibold'>Address</div>
                                    <p className='md:text-lg font-medium'>VBHC Vaibhava, Chandapura-Anekal main road, Byagadadenahalli</p>
                                    <p className='md:text-lg font-medium'>Bangalore 562106, Karnataka</p>
                                </div>
                                <div>
                                    <div className='text-sm text-gray-500 font-semibold'>Landmark</div>
                                    <p className='md:text-lg font-medium'>Nayara Petrol Station</p>
                                </div>
                            </div>
                            <div className='mb-12'>
                                <ContactButton name={data.contact.contact_name} phone={data.contact.contact_number} maskedText={"Owner"} />
                            </div>
                            <hr className='mb-12' />
                            <div className='flex lg:flex-none flex-wrap lg:grid lg:grid-flow-col lg:justify-stretch gap-x-10 lg:gap-x-5 mb-12'>
                                <div className='mb-5 lg:mb-0'>
                                    <div className='text-sm text-gray-500 font-semibold'>Type</div>
                                    <div className='md:text-lg font-medium'>{data.property_type}</div>
                                </div>
                                <div className='mb-5 lg:mb-0'>
                                    <div className='text-sm text-gray-500 font-semibold'>Availability</div>
                                    <div className='md:text-lg font-medium'>Immediate</div>
                                </div>
                                <div className='mb-5 lg:mb-0'>
                                    <div className='text-sm text-gray-500 font-semibold'>Rooms</div>
                                    <div className='md:text-lg font-medium'>{data.room_type}</div>
                                </div>
                                <div className='mb-5 lg:mb-0'>
                                    <div className='text-sm text-gray-500 font-semibold'>Direction</div>
                                    <div className='md:text-lg font-medium'>{data.property_details.facing} Facing</div>
                                </div>
                                <div className='mb-5 lg:mb-0'>
                                    <div className='text-sm text-gray-500 font-semibold'>Furnishing</div>
                                    <div className='md:text-lg font-medium'>{data.property_details.furnishing}</div>
                                </div>
                            </div>
                            <hr className='mb-12' />
                            <div className='flex lg:flex-none flex-nowrap lg:grid lg:grid-cols-5 gap-x-5 lg:gap-x-10 mb-12 overflow-x-auto'>
                                <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                    <img className='max-w-[64px]' src='/images/icons/area.png' />
                                    <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.property_details.carpet_area} Sqft</div>
                                </div>
                                <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                    <img className='max-w-[64px]' src='/images/icons/bathroom.png' />
                                    <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.property_details.bathrooms} Baths</div>
                                </div>
                                <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                    <img className='max-w-[64px]' src='/images/icons/floor.png' />
                                    <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.property_details.floor_number} Floor</div>
                                </div>
                                <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                    <img className='max-w-[64px]' src='/images/icons/balcony.png' />
                                    <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>1 Balcony</div>
                                </div>
                                <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                    <img className='max-w-[64px]' src='/images/icons/parking.png' />
                                    <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.property_details.parking_type} Parking</div>
                                </div>
                            </div>
                            <hr className='mb-12' />
                            <div className='mb-12'>
                                <h5 className='text-sm text-gray-500 font-semibold mb-5'>Amenities</h5>
                                <div className="tags">
                                    {data.amenities.map((x: any, i: any) =>
                                        <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.title}</div>
                                    )}
                                </div>
                            </div>
                            <hr className='mb-12' />
                            <div className='mb-12'>
                                <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                                {/* <Map /> */}
                                {/* <ViewLocationMap /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='lg:col-span-1 relative m-5 lg:m-0'>
                    <ContactCard heading="Owner Contact Details" name={data.contact.contact_name} contact={data.contact.contact_number} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetail