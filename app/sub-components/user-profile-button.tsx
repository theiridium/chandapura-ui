import React from 'react'
import GlobalConfig, { Resource } from "../../public/shared/app.config";
import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { IsUserLogged } from '@/lib/atom';
import { User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Menubar from './menubar';

const UserProfileButton = () => {
    const [btnToggle, setBtnToggle] = useState(false);
    const toggle = (x: boolean) => setBtnToggle(x)
    // const isUserLogged = useAtomValue<any>(IsUserLogged);
    // useEffect(() => {
    // }, [isUserLogged])

    return (
        <>
            <button className='mx-2 md:mx-4 p-3 bg-color2d/50 rounded-full' onClick={() => setBtnToggle(!btnToggle)} type="button" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                <span className="sr-only">Open user menu</span>
                <User fill='#3d30a2' className='h-[24px] w-[24px]' />
            </button>
            <AnimatePresence>
                {btnToggle &&
                    <Menubar btnToggle={toggle} isOpen={btnToggle} />
                }
            </AnimatePresence>
        </>
    )
}

export default UserProfileButton