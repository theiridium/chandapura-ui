"use client"

import FormStep from "@/app/components/stepper/form-step";
import UserItemList from "@/app/route-components/user-specific/user-item-list";
import MainMenuBtn from "@/app/sub-components/main-menu-btn";
import { areas, jobTitles, languages, listingFormBtnEl } from "@/lib/atom";
import { DropdownList } from "@/public/shared/app.config";
import { useAtomValue, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const steps = [
    {
        number: 1,
        title: "Job Details",
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
        number: 3,
        title: "Review & Publish",
        currentPath: "publish",
        nextPath: "completed"
    }
]

const JobListingForm = ({ children, resLang, resArea, resJobTitles }: { children: React.ReactNode, resLang: any, resArea: any, resJobTitles: any }) => {
    const setLanguages = useSetAtom(languages);
    const setLocations = useSetAtom(areas);
    const setJobTitles = useSetAtom(jobTitles);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const formButton = useAtomValue<React.ReactNode>(listingFormBtnEl);
    useEffect(() => {
        setLanguages(resLang);
        setLocations(resArea);
        setJobTitles(resJobTitles);
    }, [resLang, resArea, resJobTitles]);

    return (
        <>
            <div className="max-w-screen-xl mx-auto">
                <div className='grid grid-cols-10 gap-5 relative'>
                    <div className='col-span-full lg:col-span-2 my-8 order-first'>
                        <div className="sticky top-28 px-5 lg:px-7">
                            <div className='mb-5'><MainMenuBtn url='/dashboard/job-listing/view-all' /></div>
                            <UserItemList attr={DropdownList.JobList.api} title={"Select a job profile"} />
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

export default JobListingForm
