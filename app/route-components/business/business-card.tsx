"use client"
import { Products } from '@/public/shared/app.config';
import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BusinessCard = (p: any) => {
    const router = useRouter();
    const item = p.list;
    const id = p.id;
    return (
        <a href={`${Products.business.slug}/${item.category.slug}/${item.sub_category.slug}/${item.slug}?source=${id}`} className="re-card-link">
            <div className="business-card">
                <div className="business-card-img">
                    {item.featured_image === null ?
                        <img src="/images/placeholder.png" /> :
                        <img src={item.featured_image.url} />}
                </div>
                <div className="business-card-body">
                    <div className="text-xs font-bold mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{item.area.name}</span></div>
                    <div className="mb-2 truncate text-sm text-slate-600">{item.sub_category.name} / {item.category.name}</div>
                    <div className="text-sm lg:text-lg font-semibold h-[40px] lg:h-[56px] mb-3 text-slate-600">{item.name}</div>
                    <div className="flex items-center justify-between gap-x-3 gap-y-1">
                        <button onClick={() => router.push(`tel:${item.contact.contact_number}`)} className="btn-contact rounded-md lg:grow flex justify-center items-center gap-x-2 w-auto"><Phone size={16} fill='#fff' stroke='none' /><span className='hidden lg:block'>+91 {item.contact.contact_number}</span></button>
                        <button onClick={() => router.push(`${Products.business.slug}/${item.category.slug}/${item.sub_category.slug}/${item.slug}?source=${id}`)} className="btn-view_details text-center w-full lg:w-auto">View Details</button>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default BusinessCard