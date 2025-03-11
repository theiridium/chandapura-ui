import { Resource } from '@/public/shared/app.config'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'

const Menubar = (props: any) => {
    const { status, data }: any = useSession();
    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            classNames={{ base: "bg-color1d text-white w-64", closeButton: "text-color1d lg:text-color2d hover:text-color1d text-lg font-bold hover:bg-white/50 bg-white/50 lg:bg-transparent !rounded-sm" }}
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
                            <ul className="text-xl mt-8 gap-10 *:mb-8">
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
                                    <a className='hover-underline' href={Resource.Advertisement.dashboardLink}>{Resource.Advertisement.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.BusinessListing.dashboardLink}>{Resource.BusinessListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.PropertyListing.dashboardLink}>{Resource.PropertyListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.ClassifiedListing.dashboardLink}>{Resource.ClassifiedListing.label}</a>
                                </li>
                                <li className=''>
                                    <a className='hover-underline' href={Resource.JobListing.dashboardLink}>{Resource.JobListing.label}</a>
                                </li>

                            </ul>
                            <hr className='mb-8 text-white/10' />
                            <div className='*:mb-8 text-xl'>
                                <a className='hover-underline' href={Resource.Pricing.link}>{Resource.Pricing.label}</a>
                            </div>
                            {status === "authenticated" &&
                                <div className='mt-16'>
                                    <button className='bg-red-600 hover:bg-red-700 hover text-white py-2 px-4' onClick={() => signOut({ callbackUrl: '/' })}>{Resource.Logout.label}</button>
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