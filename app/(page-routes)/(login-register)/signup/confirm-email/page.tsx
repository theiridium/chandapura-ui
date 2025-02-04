"use client"
import { userEmailConfirmation } from '@/lib/apiLibrary';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import { toast } from 'react-toastify';

const Page = () => {
    const searchParams = useSearchParams();
    const emailId: any = searchParams.get('email');
    const sendEmail = async () => {
        const res = await userEmailConfirmation(emailId);
        if (!!res && res.sent) {
            toast.success("Email Sent Successfully!");
        }
        else toast.warn(res?.error);
    }
    return (
        <div className="grid lg:grid-cols-2 h-auto md:min-h-[90vh] md:overflow-auto">
            <div className=''>
                <img className='w-full h-full' src='/images/banner/confirmemail.jpg' />
            </div>
            <div className='grid grid-cols-1 lg:my-10 p-5'>
                <div className='px-3 md:px-0 w-full md:w-4/5 mx-auto text-left'>
                    <div className='text-3xl font-medium mb-5'>Check your email</div>
                    <p className='text-sm'>We&apos;ve sent an email to <span className='font-medium'>{emailId}</span> with a link to activate your account.</p>
                    <div className='text-2xl font-medium my-5 text-gray-600'>Didn&prime;t receive an email?</div>
                    <p className='text-sm mb-3'>You should get the email within a few minutes. If you don&apos;t there could be a few reasons why.</p>
                    <ul className='text-sm list-disc leading-relaxed'>
                        <li>It could have made its way into your spam folder.</li>
                        <li>You may have accidentally mistyped your email.</li>
                        <li>It might have been held by a company firewall or filter. Check with your administrator.</li>
                        <li>Not recieved the email? <button className='text-color1d hover:underline' onClick={() => sendEmail()}>Resend link</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Page