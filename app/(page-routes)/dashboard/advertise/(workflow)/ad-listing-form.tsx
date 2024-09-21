"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserBusinessList from "@/app/route-components/business/user-specific/user-business-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { categories, locations } from "@/lib/atom";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const steps = [
    {
        number: 1,
        title: "Ad Details",
        currentPath: "add-details",
        nextPath: "upload-images"
    },
    {
        number: 2,
        title: "Upload Image",
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

const AdListingForm = ({ children, resCat, resLocation }: { children: React.ReactNode, resCat: any, resLocation: any }) => {
    const setCategories = useSetAtom(categories);
    const setLocations = useSetAtom(locations);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    useEffect(() => {
        setCategories(resCat);
        setLocations(resLocation);
    }, [resCat, resLocation]);

    return (
        <div className='grid grid-cols-10 gap-5 relative'>
            <div className='col-span-full lg:col-span-2 my-8'>
                <div className="sticky top-28 px-5 lg:px-7">
                    <div className='mb-5'><MainMenuBtn url='/dashboard/advertise/view-all' /></div>
                    <UserBusinessList />
                    {(type !== "edit") && <FormStep steps={steps} />}
                </div>
            </div>
            <>{children}</>
        </div>
    )
}

export default AdListingForm
