"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserItemList from "@/app/route-components/user-specific/user-item-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { areas, categories, listingFormBtnEl, subCategories } from "@/lib/atom";
import { DropdownList } from "@/public/shared/app.config";
import { useAtomValue, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const steps = [
    {
        number: 1,
        title: "Business Details",
        currentPath: "add-details",
        nextPath: "upload-images"
    },
    {
        number: 2,
        title: "Upload Image",
        currentPath: "upload-images",
        nextPath: "review"
    },
    {
        number: 3,
        title: "Review",
        currentPath: "review",
        nextPath: "publish"
    },
    // {
    //     number: 3,
    //     title: "Review",
    //     currentPath: "review",
    //     nextPath: "payment"
    // },
    // {
    //     number: 4,
    //     title: "Payment",
    //     currentPath: "payment",
    //     nextPath: "publish"
    // }
]

const BusinessListingForm = ({ children, subCatList, resArea }: { children: React.ReactNode, subCatList: any, resArea: any }) => {
    const setSubCategories = useSetAtom(subCategories);
    const setLocations = useSetAtom(areas);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const formButton = useAtomValue<React.ReactNode>(listingFormBtnEl);
    useEffect(() => {
        setSubCategories(subCatList);
        setLocations(resArea);
    }, [subCatList, resArea]);

    return (
        <>
            <div className="max-w-screen-xl mx-auto">
                <div className='grid grid-cols-10 gap-5 relative'>
                    <div className='col-span-full lg:col-span-2 my-8'>
                        <div className="sticky top-28 px-5 lg:px-7">
                            <div className='mb-5'><MainMenuBtn url='/dashboard/business-listing/view-all' /></div>
                            <UserItemList attr={DropdownList.BusinessList.api} title={"Select a Business"} />
                            {(type !== "edit") && <FormStep steps={steps} />}
                        </div>
                    </div>
                    <>{children}</>
                </div>
            </div>
            {!!formButton && <div className="footer-sticky">
                <div className="max-w-screen-xl mx-auto">
                    <div className='grid grid-cols-10 gap-5'>
                        <div className="col-start-0 col-span-full lg:col-start-3 lg:col-span-6">{formButton}</div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default BusinessListingForm
