import { Resource } from '@/public/shared/app.config'
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'

const Menubar = (props: any) => {
    const { status, data }: any = useSession();
    return (
        <Drawer
            isOpen={props.isOpen}
            onClose={props.onClose}
            classNames={{ base: "bg-color1d text-white", closeButton: "text-color2d hover:text-color1d text-lg font-bold" }}
            size='sm'
            radius='none'>
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1 border-0">
                            <div className='text-2xl mb-2 font-medium'>Welcome back</div>
                            <div className='text-3xl font-medium'>{status === "authenticated" ? data?.user?.firstname : "Guest"} !</div>
                        </DrawerHeader>
                        <DrawerBody>
                            <ul className="text-2xl my-12 gap-10">
                                {status === "unauthenticated" &&
                                    <li className='mb-10'>
                                        <a className='hover-underline' href={Resource.Login.link}>{Resource.Login.label}</a>
                                    </li>
                                }
                                {status === "authenticated" &&
                                    <>
                                        <li className='mb-10'>
                                            <a className='hover-underline' href={Resource.MyProfile.link}>{Resource.MyProfile.label}</a>
                                        </li>
                                        <li className='mb-10'>
                                            <a className='hover-underline' href={Resource.Dashboard.link}>{Resource.Dashboard.label}</a>
                                        </li>
                                    </>
                                }
                                <li className='mb-10'>
                                    <a className='hover-underline' href={Resource.Advertisement.dashboardLink}>{Resource.Advertisement.label}</a>
                                </li>
                                <li className='mb-10'>
                                    <a className='hover-underline' href={Resource.BusinessListing.dashboardLink}>{Resource.BusinessListing.label}</a>
                                </li>
                                <li className='mb-10'>
                                    <a className='hover-underline' href={Resource.PropertyListing.dashboardLink}>{Resource.PropertyListing.label}</a>
                                </li>
                                <li className='mb-10'>
                                    <a className='hover-underline' href={Resource.ClassifiedListing.dashboardLink}>{Resource.ClassifiedListing.label}</a>
                                </li>
                                <li className='mb-10'>
                                    <a className='hover-underline' href={Resource.JobListing.dashboardLink}>{Resource.JobListing.label}</a>
                                </li>
                                {status === "authenticated" &&
                                    <li className='mb-10'>
                                        <button className='bg-red-600 hover:bg-red-700 hover text-white py-2 px-4' onClick={() => signOut({ callbackUrl: '/' })}>{Resource.Logout.label}</button>
                                    </li>
                                }
                            </ul>
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default Menubar