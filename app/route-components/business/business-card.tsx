import { Products } from '@/public/shared/app.config';
import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const BusinessCard = (p: any) => {
    const item = p.list;
    const id = p.id;
    return (
        <div className="re-card-link">
            <div className="business-card">
                <div className="business-card-img">
                    {item.featured_image === null ?
                        <img src="/images/placeholder.png" /> :
                        <img src={item.featured_image.url} />}
                </div>
                <div className="business-card-body">
                    <div className="text-xs font-bold mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{item.area}</span></div>
                    <div className="mb-2 truncate text-sm md:text-base text-slate-600">{item.sub_category.name} / {item.category.name}</div>
                    <div className="text-base md:text-lg font-semibold mb-2 lg:mb-5 text-slate-600">{item.name}</div>
                    <div className="flex items-center justify-between gap-x-3 lg:gap-x-10 gap-y-1">
                        <a href='tel:8123420507' className="btn-contact rounded-md lg:grow flex justify-center items-center gap-x-2 w-auto"><Phone size={16} fill='#fff' stroke='none' /><span className='hidden lg:block'>+91 {item.contact_number}</span></a>
                        <a href={`${Products.business.slug}/${item.category.slug}/${item.sub_category.slug}/${item.slug}?source=${id}`} className="btn-view_details text-center w-full lg:w-auto">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BusinessCard