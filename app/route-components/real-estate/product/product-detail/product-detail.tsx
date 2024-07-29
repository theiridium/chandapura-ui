"use client"
import ContactButton from '@/app/sub-components/contact-btn';
import ContactCard from '@/app/sub-components/contact-card'
import Map from '@/app/sub-components/map';
import { ConvertCurrencyToWords } from '@/lib/helpers';
import { IndianRupee } from 'lucide-react';
import React from 'react'

const ProductDetail = ({ data }: any) => {
    const contactName = `${data.user.first_name} ${data.user.last_name}`;
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
                <div className="lg:col-span-3">
                    <div className="border border-gray-300 rounded-xl bg-white p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                        <div className='grid lg:grid-rows-2 lg:grid-cols-7 gap-5 lg:gap-7 mb-12'>
                            <div className="row-span-2 col-span-4 lg:col-span-5">
                                {data.property_images === null ?
                                    <img src="/images/placeholder.png" className="w-full h-[250px] lg:h-[380px] rounded-xl" /> :
                                    <img src={data.property_images[0].url} className="w-full h-[250px] lg:h-[380px] rounded-xl" />
                                }
                            </div>
                            <div className="col-span-2">
                                {data.property_images === null ?
                                    <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                                    <img src={data.property_images[0].url} className="w-full h-full rounded-xl" />
                                }
                            </div>
                            <div className="col-span-2">
                                {data.property_images === null ?
                                    <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                                    <img src={data.property_images[0].url} className="w-full h-full rounded-xl" />
                                }
                            </div>
                        </div>
                        <div className='re-header flex-none lg:flex justify-between mb-12'>
                            <div>
                                <h1 className="text-lg lg:text-xl font-medium text-gray-500 mb-5">{data.rooms} {data.type} <span className='text-highlight'>for {data.listing_type}</span> in {data.area}</h1>
                                <h2 className="font-extrabold text-2xl lg:text-3xl">{data.name}</h2>
                            </div>
                            <div className='text-2xl font-semibold text-gray-600 flex items-center bg-color2d/70 px-5 py-1 mt-5 lg:mt-0 w-fit'><IndianRupee strokeWidth={3} size={20} />{data.listing_type === "Rent" ? ConvertCurrencyToWords(data.rental_amount) : ConvertCurrencyToWords(data.selling_amount)}</div>
                        </div>
                        <div className='mb-12'>
                            <div className='mb-5'>
                                <div className='text-sm text-gray-500 font-semibold'>Address</div>
                                <p className='text-lg font-medium'>VBHC Vaibhava, Chandapura-Anekal main road, Byagadadenahalli</p>
                                <p className='text-lg font-medium'>Bangalore 562106, Karnataka</p>
                            </div>
                            <div>
                                <div className='text-sm text-gray-500 font-semibold'>Landmark</div>
                                <p className='text-lg font-medium'>Nayara Petrol Station</p>
                            </div>
                        </div>
                        <div className='mb-12'>
                            <ContactButton name={contactName} phone={data.user.phone} maskedText={"Owner"} />
                        </div>
                        <hr className='mb-12' />
                        <div className='flex lg:flex-none flex-wrap lg:grid lg:grid-flow-col lg:justify-stretch gap-x-10 lg:gap-x-5 mb-12'>
                            <div className='mb-5 lg:mb-0'>
                                <div className='text-sm text-gray-500 font-semibold'>Type</div>
                                <div className='text-lg font-medium'>{data.type}</div>
                            </div>
                            <div className='mb-5 lg:mb-0'>
                                <div className='text-sm text-gray-500 font-semibold'>Availability</div>
                                <div className='text-lg font-medium'>Immediate</div>
                            </div>
                            <div className='mb-5 lg:mb-0'>
                                <div className='text-sm text-gray-500 font-semibold'>Rooms</div>
                                <div className='text-lg font-medium'>{data.rooms}</div>
                            </div>
                            <div className='mb-5 lg:mb-0'>
                                <div className='text-sm text-gray-500 font-semibold'>Direction</div>
                                <div className='text-lg font-medium'>{data.facing} Facing</div>
                            </div>
                            <div className='mb-5 lg:mb-0'>
                                <div className='text-sm text-gray-500 font-semibold'>Furnishing</div>
                                <div className='text-lg font-medium'>{data.furnishing} Furnished</div>
                            </div>
                        </div>
                        <hr className='mb-12' />
                        <div className='flex lg:flex-none flex-nowrap lg:grid lg:grid-cols-5 gap-x-5 lg:gap-x-10 mb-12 overflow-x-auto'>
                            <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                <img className='max-w-[64px]' src='/images/icons/area.png' />
                                <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.carpet_area} Sqft</div>
                            </div>
                            <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                <img className='max-w-[64px]' src='/images/icons/bathroom.png' />
                                <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.bathrooms} Baths</div>
                            </div>
                            <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                <img className='max-w-[64px]' src='/images/icons/floor.png' />
                                <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.floor_number} Floor</div>
                            </div>
                            <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                <img className='max-w-[64px]' src='/images/icons/balcony.png' />
                                <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>1 Balcony</div>
                            </div>
                            <div className='border rounded-lg aspect-square grid place-items-center text-center p-2'>
                                <img className='max-w-[64px]' src='/images/icons/parking.png' />
                                <div className='text-xs lg:text-sm text-gray-500 font-semibold w-24 lg:w-auto'>{data.parking_type} Parking</div>
                            </div>
                        </div>
                        <hr className='mb-12' />
                        <div className='mb-12'>
                            <h5 className='text-sm text-gray-500 font-semibold mb-5'>Amenities</h5>
                            <div className="tags">
                                {data.real_estate_amenities.map((x: any, i: any) =>
                                    <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.title}</div>
                                )}
                            </div>
                        </div>
                        <hr className='mb-12' />
                        <div className='mb-12'>
                            <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                            <Map />
                        </div>
                    </div>
                </div>
                <div className='lg:col-span-1 relative'>
                    <ContactCard heading="Owner Contact Details" name={contactName} contact={data.user.phone} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetail