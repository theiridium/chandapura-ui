"use client"
import ContactCard from '@/app/sub-components/contact-card'
import React from 'react'
import ImageGallery from '@/app/components/modals/image-gallery';
import { useDisclosure } from '@nextui-org/react';
import { Products } from '@/public/shared/app.config';
import Sale from './components/sale';
import Rent from './components/rent';
import Plot from './components/plot';
import PG from './components/pg';

const ProductDetail = ({ data, product }: any) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
                detailsComp = <Plot {...{ ...props, property_details: property_details }} />
            }
            else detailsComp = <Sale {...props} />
            break;
        case "Rent":
            detailsComp = <Rent {...props} />
            break;
        case "PG":
            detailsComp = <PG {...props} />
            break;
        default:
            <></>
            break;
    }
    return (
        <div>
            <ImageGallery isOpen={isOpen} onOpenChange={onOpenChange} list={data.gallery_images} />
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