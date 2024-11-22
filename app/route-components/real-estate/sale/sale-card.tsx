import { ConvertCurrencyToWords } from '@/lib/helpers';
import { Products } from '@/public/shared/app.config';
import { IndianRupee, MapPin } from 'lucide-react';
import React from 'react'

const SaleCard = (p: any) => {
    const item = p.list;
    const id = p.id;
    return (
        <a href={`${Products.sale.url}/${item.slug}?source=${id}`} className="re-card-link">
            <div className="re-card">
                <div className="re-card-img">
                    {item.featured_image === null ?
                        <img src="/images/placeholder.png" /> :
                        <img src={item.featured_image.url} />}
                </div>
                <div className="re-card-body">
                    <div className="text-xs font-bold mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{item.area.name}</span></div>
                    <div className="text-sm flex items-center justify-between mb-2 text-slate-600">
                        <div>{item.room_type} {item.property_type}</div>
                        <div className="justify-self-end mr-2">{item.property_details.carpet_area} sqft</div>
                    </div>
                    <div className="text-base font-semibold mb-2 truncate text-slate-600">{item.name}</div>
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-semibold flex items-center text-slate-700"><IndianRupee size={20} strokeWidth={2.5} />{item.listing_type === "Sale" ? ConvertCurrencyToWords(item.property_details.selling_amount) : ConvertCurrencyToWords(item.property_details.rental_amount)}</div>
                        <button className="btn-view_details justify-self-end">View Details</button>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default SaleCard