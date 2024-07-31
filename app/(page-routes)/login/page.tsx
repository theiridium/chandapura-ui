"use client"
import { getPublicApiResponse } from '@/lib/interceptor';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl: any = searchParams.get('redirect')
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const ValidateLogin = async (e: any) => {
        e.preventDefault()
        if (isRegisteredUser) {
            signIn("credentials", {
                email: email,
                password: password,
                redirect: true,
                callbackUrl: callbackUrl
            })
        }
        else {
            let user = null;
            const res = await getPublicApiResponse(`users?fields[0]=email&filters[email][$eq]=${email}`);
            user = res[0];
            if (user) setIsRegisteredUser(true);
            else router.push('/signup')
        }
    };
    return (
        <div className="grid lg:grid-cols-2 h-auto md:h-[90vh] md:overflow-auto">
            <div className='hidden md:block'>
                <img className='w-full h-full' src='/images/banner/login.jpg' />
            </div>
            <div className='grid grid-cols-1 place-content-center my-8'>
                <div className='px-3 md:px-0 w-full md:w-4/5 mx-auto text-center'>
                    <div className='login-form'>
                        <h1 className='text-4xl font-extrabold mb-8'>Log in / Sign up</h1>
                        <p className='text-xl font-bold color text-gray-400 mb-16'>Some description for user before login</p>
                        <input className='text-login-form mb-5' placeholder='Enter your Email ID' type='text' onChange={(e) => { setEmail(e.target.value) }} value={email} />
                        {isRegisteredUser &&
                            <input className='text-login-form mb-5' placeholder='Enter your Password' type='password' onChange={(e) => { setPassword(e.target.value) }} value={password} />
                        }
                        <button className='btn-login-form' onClick={ValidateLogin}>CONTINUE</button>
                    </div>
                    <div className='mt-14 mb-10'>
                        <hr className='border-gray-300' />
                        <div className='-mt-3 text-lg'><span className='bg-white px-3 text-gray-500'>OR</span></div>
                    </div>
                    <div className='soc-login mb-8'>
                        <button className='btn-soclogin-form' onClick={() => signIn('google', { callbackUrl: callbackUrl })}>Continue with Google</button>
                    </div>
                    <div className='text-tnc'>
                        <p>By creating an account or logging in, you agree with Chandapura.com&apos;s Terms and Conditions and Privacy Policy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page