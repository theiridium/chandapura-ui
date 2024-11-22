"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserBusinessList from "@/app/route-components/business/user-specific/user-business-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { areas, amenities } from "@/lib/atom";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const steps = [
    {
        number: 1,
        title: "Property Details",
        currentPath: "add-details",
        nextPath: "upload-images"
    },
    {
        number: 2,
        title: "Upload Images",
        currentPath: "upload-images",
        nextPath: "payment"
    },
    {
        number: 3,
        title: "Payment",
        currentPath: "payment",
        nextPath: "publish"
    },
    {
        number: 4,
        title: "Review & Publish",
        currentPath: "publish",
        nextPath: "completed"
    }
]

const PropertyListingForm = ({ children, resAmenities, resArea }: { children: React.ReactNode, resAmenities: any, resArea: any }) => {
    const setAmenities = useSetAtom(amenities);
    const setAreas = useSetAtom(areas);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    useEffect(() => {
        setAmenities(resAmenities);
        setAreas(resArea);
    }, [resAmenities, resArea]);

    return (
        <div className='grid grid-cols-10 gap-5 relative'>
            <div className='col-span-full lg:col-span-2 my-8'>
                <div className="sticky top-28 px-5 lg:px-7">
                    <div className='mb-5'><MainMenuBtn url='/dashboard/property-listing/view-all' /></div>
                    <UserBusinessList />
                    {(type !== "edit") && <FormStep steps={steps} />}
                </div>
            </div>
            <>{children}</>
        </div>
    )
}

export default PropertyListingForm
