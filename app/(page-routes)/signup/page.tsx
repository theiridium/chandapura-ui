"use client"
import { Button, Input } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl: any = searchParams.get('redirect');
    const paramType: any = searchParams.get('type');
    const paramEmail: any = searchParams.get('email');
    const [infoText, setInfoText] = useState("");
    useEffect(() => {
        (paramType.toLowerCase() === "newregistration") && setInfoText("Your email is not registered.");
    }, [])
    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm<any>({
        defaultValues: {
            email: paramEmail
        }
    });
    const onSubmit: SubmitHandler<any> = (data) => {
        const username = data.email.split("@")[0];
        let payload = {...data, username: username, role: "Authenticated"};
        console.log(payload)
    }

    return (
        <div className="grid lg:grid-cols-2 h-auto md:min-h-[90vh] md:overflow-auto">
            <div className='grid grid-cols-1 place-content-center my-8'>
                <div className='px-3 md:px-0 w-full md:w-4/5 mx-auto text-center'>
                    <h1 className='text-4xl font-bold mb-8'>Sign up</h1>
                    <p className='text-xl font-semibold color text-gray-400 mb-12'>{infoText && (infoText + " ")}Create an account today to enjoy full access!</p>
                    <div className='soc-login mb-8'>
                        <button className='btn-soclogin-form' onClick={() => signIn('google', { callbackUrl: callbackUrl || "/" })}>
                            <span className='flex gap-3'><img src='/images/icons/google-logo.svg' />Continue with Google</span>
                        </button>
                    </div>
                    <div className='mt-14 mb-10'>
                        <hr className='border-gray-300' />
                        <div className='-mt-3 text-lg'><span className='bg-white px-3 text-gray-500'>OR</span></div>
                    </div>
                    <form className='login-form mb-8' onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex gap-5 !w-full md:!w-3/4 m-auto'>
                            <Input isRequired {...register("firstname")} className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="First Name" />
                            <Input isRequired {...register("lastname")} className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="Last Name" />
                        </div>
                        <Input isRequired {...register("email")} className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="Email ID" isClearable />
                        <Input isRequired {...register("phone")} className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="Mobile Number" />
                        <Input isRequired {...register("password")} className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="Enter Password" />
                        <Input isRequired className='text-login-form mb-5' radius='sm' type="text" variant="flat" label="Re-enter Password" />
                        <Button className='btn-login-form' color='primary' type='submit'>CONTINUE</Button>
                    </form>
                    <div className='text-tnc'>
                        <p>By creating an account or logging in, you agree with Chandapura.com&apos;s Terms and Conditions and Privacy Policy.</p>
                    </div>
                </div>
            </div>
            <div className='hidden md:block'>
                <img className='w-full h-full' src='/images/banner/signup.jpg' />
            </div>
        </div>
    )
}

export default Page