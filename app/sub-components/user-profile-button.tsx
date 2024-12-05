"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import { User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Menubar from './menubar';
import { useSession } from 'next-auth/react';

const UserProfileButton = () => {
    const [btnToggle, setBtnToggle] = useState(false);
    const toggle = (x: boolean) => setBtnToggle(x);
    const { data }: any = useSession();
    const userData = data?.user;

    useEffect(() => {
        if (btnToggle) {
            // Add styles to prevent scrolling when menu is open
            document.documentElement.style.paddingRight = "0px";
            document.documentElement.style.overflow = "hidden";
        } else {
            // Reset styles when menu is closed
            document.documentElement.style.paddingRight = "";
            document.documentElement.style.overflow = "";
        }

        // Cleanup on component unmount
        return () => {
            document.documentElement.style.paddingRight = "";
            document.documentElement.style.overflow = "";
        };
    }, [btnToggle]);

    return (
        <>
            {userData && userData.image ?
                <button className='mx-2 md:mx-4 border-2 border-color1d hover:border-color2d rounded-full' onClick={() => setBtnToggle(!btnToggle)} type="button" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span className="sr-only">Open user menu</span>
                    <img src={userData.image} className='h-[44px] w-[44px] md:h-[48px] md:w-[48px] rounded-full' />
                </button> :
                <button className='mx-2 md:mx-4 p-2 bg-color2d rounded-full text-color1d border-2 border-color2d' onClick={() => setBtnToggle(!btnToggle)} type="button" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span className="sr-only">Open user menu</span>
                    <User strokeWidth={2.2} fill='#ffc901' className='h-[24px] w-[24px]' />
                </button>
            }
            <AnimatePresence initial={false}>
                {btnToggle &&
                    <Menubar btnToggle={toggle} isOpen={btnToggle} />
                }
            </AnimatePresence>
        </>
    )
}

export default UserProfileButton