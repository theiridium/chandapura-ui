"use client"
import ContactCard from '@/app/sub-components/contact-card'
import React from 'react'
import ImageGallery from '@/app/components/modals/image-gallery';
import { useDisclosure } from '@nextui-org/react';
import { Products } from '@/public/shared/app.config';
import PropertyDetailSale from './components/property-detail-sale';
import PropertyDetailRent from './components/property-detail-rent';
import PropertyDetailPlot from './components/property-detail-plot';
import PropertyDetailPG from './components/property-detail-pg';

const ProductDetail = ({ data, product }: any) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const all_images = [data.featured_image, ...(data.gallery_images ?? [])];
    let property_details = data.details_by_listingtype.find((x: any) => x.__component == product.api.component);
    let detailsComp = <></>;
    const props = {
        data: data,
        onOpen: onOpen,
        property_details: property_details
    }
    switch (data.listing_type) {
        case "Sale":
            if (data.property_type === "Plot") {
                property_details = data.details_by_listingtype.find((x: any) => x.__component == Products.plot.api.component);
                detailsComp = <PropertyDetailPlot {...{ ...props, property_details: property_details }} />
            }
            else detailsComp = <PropertyDetailSale {...props} />
            break;
        case "Rent":
            detailsComp = <PropertyDetailRent {...props} />
            break;
        case "PG":
            detailsComp = <PropertyDetailPG {...props} />
            break;
        default:
            <></>
            break;
    }
    return (
        <div>
            <ImageGallery isOpen={isOpen} onOpenChange={onOpenChange} list={all_images} />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
                {detailsComp}
                <div className='lg:col-span-1 relative m-5 lg:m-0'>
                    <ContactCard heading="Owner Contact Details" name={data.contact.contact_name} contact={data.contact.contact_number} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetail