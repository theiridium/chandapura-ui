import { Resource } from '@/public/shared/app.config'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react"
import { signOut, useSession } from 'next-auth/react'

const Menubar = (props: any) => {
    const { status, data }: any = useSession();
    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            // classNames={{ base: "bg-gradient-to-b from-color1d via-color1d/90 to-color1d/30 text-white w-64", closeButton: "text-color1d lg:text-color2d hover:text-color1d text-lg font-bold hover:bg-white/50 bg-white/50 lg:bg-transparent !rounded-sm" }}
            classNames={{
                base: "bg-color1d text-white w-64",
                closeButton: "text-color1d lg:text-color2d hover:text-color1d text-lg font-bold hover:bg-white/30 bg-white/30 lg:bg-transparent !rounded-sm"
            }}
            size='sm'
            radius='none'>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 border-0">
                            <div className='text-xl mb-2 font-medium text-white/70'>Welcome back</div>
                            <div className='text-xl font-normal'>{status === "authenticated" ? data?.user?.firstname : "Guest"} !</div>
                        </DrawerHeader>
                        <DrawerBody>
                            <ul className="text-xl mt-8 gap-10 *:mb-5">
                                {status === "unauthenticated" &&
                                    <li className=''>
                                        <a className='hover-underline' href={Resource.Login.link}>{Resource.Login.label}</a>
                                    </li>
                                }
                                {status === "authenticated" &&
                                    <>
                                        {/* <li className=''>
                                            <a className='hover-underline' href={Resource.MyProfile.link}>{Resource.MyProfile.label}</a>
                                        </li> */}
                                        {/* <li className=''>
                                            <a className='hover-underline' href={Resource.Dashboard.link}>{Resource.Dashboard.label}</a>
                                        </li> */}
                                    </>
                                }
                                <li className=''>
                                    <a className='hover-underline' href={Resource.BusinessListing.dashboardLink}>{Resource.BusinessListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.ClassifiedListing.dashboardLink}>{Resource.ClassifiedListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.JobListing.dashboardLink}>{Resource.JobListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.PropertyListing.dashboardLink}>{Resource.PropertyListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.Advertisement.dashboardLink}>{Resource.Advertisement.label}</a>
                                </li>

                            </ul>
                            <hr className='my-5 text-white/10' />
                            <ul className='mt-5 *:mb-5 text-sm *:border *:border-white/50 *:px-2 *:py-1 *:text-center'>
                                <li className='hover:bg-white/20'>
                                    <a className='block w-full' href={Resource.Pricing.link}>{Resource.Pricing.label}</a>
                                </li>
                                <li className='hover:bg-white/20'>
                                    <a className='block w-full' href={Resource.CategoryRefBook.link}>{Resource.CategoryRefBook.label}</a>
                                </li>
                                <li className='hover:bg-white/20'>
                                    <a className='block w-full' href={Resource.BannerAdGuidelines.link}>{Resource.BannerAdGuidelines.label}</a>
                                </li>
                            </ul>
                            {status === "authenticated" &&
                                <div className='mt-8'>
                                    <button className='bg-red-600 hover:bg-red-700 hover text-white py-2 px-4 w-full' onClick={() => signOut({ callbackUrl: '/' })}>{Resource.Logout.label}</button>
                                </div>
                            }
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default Menubar