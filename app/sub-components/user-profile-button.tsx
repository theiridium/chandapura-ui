"use client"
import React from 'react'
import { User, X } from 'lucide-react';
import Menubar from './menubar';
import { useSession } from 'next-auth/react';
import { useDisclosure } from '@nextui-org/react';

const UserProfileButton = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <>
            {userData && userData.image ?
                <button className='mx-2 md:mx-4 border-2 border-color1d hover:border-color2d rounded-full' onClick={() => onOpen()} type="button" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span className="sr-only">Open user menu</span>
                    <img src={userData.image} className='h-[44px] w-[44px] md:h-[48px] md:w-[48px] rounded-full' />
                </button> :
                <button className='mx-2 md:mx-4 p-2 bg-color2d rounded-full text-color1d border-2 border-color2d' onClick={() => onOpen()} type="button" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span className="sr-only">Open user menu</span>
                    <User strokeWidth={2.2} fill='#ffc901' className='h-[24px] w-[24px]' />
                </button>
            }
            <div>
                <Menubar isOpen={isOpen} onClose={onClose} />
            </div>
        </>
    )
}

export default UserProfileButton