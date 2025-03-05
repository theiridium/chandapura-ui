"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserItemList from "@/app/route-components/user-specific/user-item-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { listingFormBtnEl } from "@/lib/atom";
import { DropdownList } from "@/public/shared/app.config";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

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

const AdListingForm = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const formButton = useAtomValue<React.ReactNode>(listingFormBtnEl);
    return (
        <>
            <div className="max-w-screen-xl mx-auto">
                <div className='grid grid-cols-10 gap-5 relative'>
                    <div className='col-span-full lg:col-span-2 my-8'>
                        <div className="sticky top-28 px-5 lg:px-7">
                            <div className='mb-5'><MainMenuBtn url='/dashboard/advertise/view-all' /></div>
                            <UserItemList attr={DropdownList.AdvertisementList.api} title={"Select an Advertisement"} />
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

export default AdListingForm
