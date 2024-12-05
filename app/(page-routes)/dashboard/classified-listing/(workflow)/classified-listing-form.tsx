"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserItemList from "@/app/route-components/user-specific/user-item-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { areas, classifiedCategories } from "@/lib/atom";
import { DropdownList } from "@/public/shared/app.config";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const steps = [
    {
        number: 1,
        title: "Classified Details",
        currentPath: "add-details",
        nextPath: "upload-images"
    },
    {
        number: 2,
        title: "Upload Images",
        currentPath: "upload-images",
        nextPath: "payment"
    },
    // {
    //     number: 3,
    //     title: "Payment",
    //     currentPath: "payment",
    //     nextPath: "publish"
    // },
    {
        number: 4,
        title: "Review & Publish",
        currentPath: "publish",
        nextPath: "completed"
    }
]

const ClassifiedListingForm = ({ children, resCat, resArea }: { children: React.ReactNode, resCat: any, resArea: any }) => {
    const setCategories = useSetAtom(classifiedCategories);
    const setLocations = useSetAtom(areas);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    useEffect(() => {
        setCategories(resCat);
        setLocations(resArea);
    }, [resCat, resArea]);

    return (
        <div className='grid grid-cols-10 gap-5 relative'>
            <div className='col-span-full lg:col-span-2 my-8'>
                <div className="sticky top-28 px-5 lg:px-7">
                    <div className='mb-5'><MainMenuBtn url='/dashboard/classified-listing/view-all' /></div>
                    <UserItemList attr={DropdownList.ClassifiedList.api} title={"Select a Classified"} />
                    {(type !== "edit") && <FormStep steps={steps} />}
                </div>
            </div>
            <>{children}</>
        </div>
    )
}

export default ClassifiedListingForm
