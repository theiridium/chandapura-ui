"use client"
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { Button, Input } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl: any = searchParams.get('callbackUrl');
    const redirectUrl: any = searchParams.get('redirect');
    const error: any = searchParams.get('error');
    const isRegistered: any = searchParams.get('registered');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegisteredUser, setIsRegisteredUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [domain, setDomain] = useState("");
    const [_callbackUrl, setCallbackUrl] = useState<string>("");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setDomain(window.location.origin);
        }
    }, []);
    useEffect(() => {
        if (callbackUrl || redirectUrl)
            setCallbackUrl(callbackUrl || domain + redirectUrl)
        else setCallbackUrl("")
    }, [callbackUrl, redirectUrl])

    const ValidateLogin = async (e: any) => {
        setIsLoading(true);
        const callBackUrlStr = (callbackUrl || redirectUrl) ? `&callbackUrl=${callbackUrl || domain + redirectUrl}` : "/";
        e.preventDefault();
        if (isRegisteredUser) {
            setIsLoading(true);
            signIn("credentials", {
                email: email,
                password: password,
                redirect: true,
                callbackUrl: _callbackUrl
            })
        }
        else {
            let user = null;
            const res = await getPublicApiResponse(`users?fields[0]=email&fields[1]=provider&filters[email][$eq]=${email}`);
            user = res[0];
            if (user && user.provider === "local") setIsRegisteredUser(true);
            else if (user && user.provider === "google")
                toast.warn("You have an existing account with Google. Please continue with Google.", { autoClose: false });
            else router.push(`/signup?type=NewRegistration&email=${email}${callBackUrlStr}`);
            setIsLoading(false);
        }
    };
    const forgotPassword = (e: any) => {
        e.preventDefault();
        router.push(`/forgot-password`);
    }

    useEffect(() => {
        isRegistered && toast.success("Your account registered successfully! Please continue login with Email ID and Password.", { autoClose: false, theme: "colored" });
    }, [])

    useEffect(() => {
        (error === "CredentialsSignin") && toast.error("Invalid Credentials!", { autoClose: false, theme: "colored" });
    }, [error])

    return (
        <div className="grid lg:grid-cols-2 h-auto md:h-[90vh] md:overflow-auto">
            <div className='hidden md:block'>
                <img className='w-full h-full' src='/images/banner/login.jpg' />
            </div>
            <div className='grid grid-cols-1 my-8 place-content-center'>
                <div className='px-3 md:px-0 w-full md:w-4/5 mx-auto text-center'>
                    <div className='login-form'>
                        <h1 className='text-4xl font-bold mb-8'>Log in / Sign up</h1>
                        <p className='text-xl font-semibold color text-gray-400 mb-10'>Login to access your resources</p>
                        <div className='soc-login mb-8'>
                            <button className='btn-soclogin-form' onClick={() => signIn('google', { callbackUrl: _callbackUrl })}>
                                <span className='flex gap-3'><img src='/images/icons/google-logo.svg' />Continue with Google</span>
                            </button>
                        </div>
                    </div>
                    <div className='mt-14 mb-10'>
                        <hr className='border-gray-300' />
                        <div className='-mt-3 text-lg'><span className='bg-white px-3 text-gray-500'>OR</span></div>
                    </div>
                    <form className='login-form' onSubmit={ValidateLogin}>
                        <Input className='text-login-form mb-5' radius='sm' type="email" variant="flat" label="Enter your Email ID" onChange={(e) => { setEmail(e.target.value) }} value={email} />
                        {(isRegisteredUser || !!error) &&
                            <div className='mb-5'>
                                <Input className='text-login-form' radius='sm' type="password" variant="flat" label="Enter your Password" onChange={(e) => { setPassword(e.target.value) }} value={password} />
                                <div className='text-forgot-pass mt-2'><button className='hover:underline' onClick={(e: any) => forgotPassword(e)}>I&apos;ve forgotton my password</button></div>
                            </div>
                        }
                        <Button isLoading={isLoading} className='btn-login-form' color='primary' type='submit' isDisabled={!email}>Sign in with Credentials</Button>
                        <p className='my-5'>Don&apos;t have an account? <a className='text-color1d hover:underline cursor-pointer' href='/signup'>Sign Up</a></p>
                    </form>
                    <div className='text-tnc'>
                        <p>By creating an account or logging in, you agree with Chandapura.com&apos;s <a href='#' className='text-color1d hover:underline'>Terms and Conditions</a> and <a href='#' className='text-color1d hover:underline'>Privacy Policy</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page