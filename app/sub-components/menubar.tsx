import { Resource } from '@/public/shared/app.config'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const Menubar = (props: any) => {
    const { status, data }: any = useSession();
    const var_menu = {
        hidden: {
            opacity: 0,
            x: '100vw',
            duration: 2,
            ease: "linear",
            transition: { type: 'tween' }
        },
        visible: {
            opacity: 1,
            x: 0,
            duration: 2,
            ease: "linear",
            transition: { type: 'tween' }
        },
        bgHidden: {
            opacity: 0,
            duration: 2,
            ease: "linear"
        },
        bgVisible: {
            opacity: 1,
            duration: 2,
            ease: "linear"
        }
    }
    return (
        <motion.div className='sidemenubar fixed w-screen h-screen top-0 right-0 bg-overlay/50' variants={var_menu} initial="bgHidden" animate="bgVisible" exit="bgHidden">
            <motion.div className='h-screen fixed w-full md:w-96 bg-color1d text-white absolute top-0 right-0 p-10' variants={var_menu} initial="hidden" animate="visible" exit="hidden">
                {status === "authenticated" &&
                    <>
                        <div className='text-2xl mb-2'>Welcome back</div>
                        <div className='text-3xl font-semibold'>{data?.user?.firstname} !</div>
                    </>
                }
                <button className='absolute right-7 top-5 hover:text-color2d' onClick={() => props.btnToggle(!props.isOpen)}>
                    <X strokeWidth={3} size={34} />
                </button>
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
                            <button className='bg-purple-950 text-red-500 py-2 px-4' onClick={() => signOut({ callbackUrl: '/' })}>{Resource.Logout.label}</button>
                        </li>
                    }
                </ul>
            </motion.div>
        </motion.div>
    )
}

export default Menubar