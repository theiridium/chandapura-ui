"use client"
import { Resource } from "@/public/shared/app.config";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ContactCard = ({ heading, name, contact }: any) => {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const pageUrl = `${pathname}?${searchParams}`;
    return (
        <div className="border border-gray-300 rounded-xl bg-white p-5 lg:p-7 gap-x-5 lg:gap-x-7 lg:sticky lg:top-[6.5rem]">
            <div className='realEstate-contact'>
                <h5 className='text-lg font-semibold text-gray-500 mb-7'>{heading}</h5>
                {session.status === "authenticated" ?
                    <div className="flex lg:block justify-between lg:justify-normal">
                        <div className='mb-5'>
                            <div className='text-sm text-gray-500 font-semibold'>Name</div>
                            <div className='text-lg font-semibold'>{name}</div>
                        </div>
                        <div>
                            <div className='text-sm text-gray-500 font-semibold'>Contact</div>
                            <div className='text-lg font-semibold'>+91 {contact}</div>
                        </div>
                    </div> :
                    <button className="btn-primary" onClick={() => router.push(Resource.Login.link + "?redirect=" + pageUrl)}>{Resource.Login.label}</button>
                }

            </div>
        </div>
    )
}

export default ContactCard