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
                <button className='absolute right-7 top-5' onClick={() => props.btnToggle(!props.isOpen)}>
                    <X strokeWidth={3} size={34} />
                </button>
                <ul className="text-3xl my-14 gap-10">
                    {status === "unauthenticated" &&
                        <li className='mb-10'>
                            <a href={Resource.Login.link}>{Resource.Login.label}</a>
                        </li>
                    }
                    {status === "authenticated" &&
                        <>
                            <li className='mb-10'>
                                <a href={Resource.MyProfile.link}>{Resource.MyProfile.label}</a>
                            </li>
                            <li className='mb-10'>
                                <a href={Resource.Dashboard.link}>{Resource.Dashboard.label}</a>
                            </li>
                        </>
                    }
                    <li className='mb-10'>
                        <a href={Resource.BusinessListing.link}>{Resource.BusinessListing.label}</a>
                    </li>
                    <li className='mb-10'>
                        <a href={Resource.Advertisement.link}>{Resource.Advertisement.label}</a>
                    </li>
                    {status === "authenticated" &&
                        <li className='mb-10'>
                            <button onClick={() => signOut({ callbackUrl: '/' })}>{Resource.Logout.label}</button>
                        </li>
                    }
                </ul>
            </motion.div>
        </motion.div>
    )
}

export default Menubar