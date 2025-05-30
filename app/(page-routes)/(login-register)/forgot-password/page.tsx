"use client"
import { userForgotPassword } from '@/lib/apiLibrary';
import { Button, Input } from "@heroui/react"
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const forgotPassword = async () => {
        setIsLoading(true);
        const res = await userForgotPassword(email);
        if (!!res && res.ok) {
            toast.success("Email Sent Successfully!", { autoClose: false, theme: "colored" });
            setEmail("");
        }
        else toast.error(res?.error, { autoClose: false, theme: "colored" });
        setIsLoading(false);
    }
    return (
        <div className='max-w-screen-md mx-auto py-10'>
            <div className='text-xl md:text-3xl mb-5 text-center'>Forgotten your password?</div>
            <div className='px-5 pt-10 pb-12 md:px-3 mt-3 lg:my-6 bg-color2d/30'>
                <div className='login-form text-center'>
                    <p className='w-full md:w-3/4 mx-auto text-left mb-5'>We&apos;ve got you covered. Enter your email address and we&apos;ll send you instructions on how to reset it.</p>
                    <Input className='text-login-form mb-5' radius='sm' type="email" variant="flat" label="Enter your Email ID" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                    <div >
                        <Button onPress={() => forgotPassword()} isLoading={isLoading} className='btn-login-form !mx-auto' color='primary' type='submit' isDisabled={!email}>Request Password Reset</Button>
                    </div>
                    <div className='text-remember-pass mt-5'>Remembered your password? <a href='/login' className='text-color1d cursor-pointer hover:underline'>Log in here</a></div>
                </div>
            </div>
        </div>
    )
}

export default Page