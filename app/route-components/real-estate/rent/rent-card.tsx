import { ConvertCurrencyToWords } from '@/lib/helpers';
import { Products } from '@/public/shared/app.config';
import { IndianRupee, MapPin } from 'lucide-react';
import React from 'react'

const RentCard = (p: any) => {
    const item = p.list;
    const id = p.id;
    return (
        <a href={`${Products.rent.url}/${item.slug}?source=${id}`} className="re-card-link">
            <div className="re-card">
                <div className="re-card-img">
                    {item.property_images === null ?
                        <img src="/images/placeholder.png" /> :
                        <img src={item.property_images[0].url} />}
                </div>
                <div className="re-card-body">
                    <div className="text-xs font-bold mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{item.area}</span></div>
                    <div className="text-base flex items-center justify-between mb-2">
                        <div>{item.rooms} {item.type}</div>
                        <div className="justify-self-end mr-2">{item.carpet_area} sqft</div>
                    </div>
                    <div className="text-lg font-semibold mb-2">{item.name}</div>
                    <div className="flex items-center justify-between">
                        <div className="text-xl font-semibold flex items-center"><IndianRupee size={20} strokeWidth={2.5} />{item.listing_type === "Sale" ? ConvertCurrencyToWords(item.selling_amount) : ConvertCurrencyToWords(item.rental_amount)}</div>
                        <button className="btn-view_details justify-self-end">View Details</button>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default RentCard