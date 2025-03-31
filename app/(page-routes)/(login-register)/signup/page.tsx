"use client"
import { Button, Input } from "@heroui/react"
import { useEffect, useMemo, useState } from 'react'
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { userRegistration } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import { PageLinks } from "@/public/shared/app.config";

const Page = () => {
    const searchParams = useSearchParams();
    const callbackUrl: any = searchParams.get('redirect');
    const paramType: any = searchParams.get('type');
    const paramEmail: any = searchParams.get('email');
    const router = useRouter();
    const [infoText, setInfoText] = useState("");
    const [capVal, setCapVal] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [rePasswordTxt, setRePasswordTxt] = useState("");
    useEffect(() => {
        (paramType && (paramType.toLowerCase() === "newregistration") && setInfoText("Your email is not registered."));
    }, []);
    const {
        register,
        handleSubmit,
        reset,
        watch
    } = useForm<any>({
        defaultValues: {
            email: paramEmail
        }
    });
    const password = watch('password');
    const isPasswordMatch = useMemo(() => {
        if (rePasswordTxt === "") return true;
        return (rePasswordTxt === password) ? true : false;
    }, [rePasswordTxt]);
    const onSubmit: SubmitHandler<any> = async (data) => {
        setIsLoading(true);
        const username = data.email.split("@")[0];
        let payload = { ...data, username: username, role: "Authenticated" };
        const response = await userRegistration(payload);
        if (!!response?.user) {
            router.push(`/signup/confirm-email?email=${payload.email}`)
        }
        else if (!!response?.error) {
            toast.error(response?.error);
            setRePasswordTxt("");
            setIsLoading(false);
        }
        else {
            toast.error("Something went wrong! Please try again later or contact support.");
            setRePasswordTxt("");
            setIsLoading(false);
        }
    }

    return (
        <>
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
                            <Input isRequired {...register("phone")} className='text-login-form mb-5' radius='sm' type="tel" variant="flat" label="Mobile Number" isClearable
                                validate={(val) => {
                                    if (!val) return "Phone number is required.";
                                    if (!/^\d{10}$/.test(val)) return "Enter a valid 10-digit phone number.";
                                    return null;
                                }} />
                            <Input isRequired {...register("password")} className='text-login-form mb-5' radius='sm' type="password" variant="flat" label="Enter Password"
                                validate={(val) => {
                                    if (!val) return "Password is required.";
                                    if (val.length < 8) return "Password must be at least 8 characters.";
                                    if (val.length > 15) return "Password must not exceed 15 characters.";
                                    return null; // No error
                                }} />
                            <Input isRequired
                                validate={() => {
                                    if (!isPasswordMatch) return "Password does not match.";
                                    return null; // No error
                                }}
                                className='text-login-form mb-5' radius='sm' type="password" variant="flat" label="Re-enter Password" errorMessage="Password does not match" value={rePasswordTxt} onChange={(e: any) => setRePasswordTxt(e.target.value)} />
                            <ReCAPTCHA
                                className='!w-full md:!w-3/4 !font-semibold !text-gray-500 !mx-auto mb-5'
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
                                onChange={(capVal: any) => setCapVal(capVal)}
                            />
                            <Button className='btn-login-form' color='primary' type='submit' isDisabled={!capVal} isLoading={isloading}>CONTINUE</Button>
                            <p className='my-5'>Already have an account? <a className='text-color1d hover:underline cursor-pointer' href='/login'>Sign In</a></p>
                        </form>
                        <div className='text-tnc'>
                            <p>By creating an account or logging in, you agree with Chandapura.com&apos;s <a href={PageLinks.termsAndConditions} target="_blank" className='text-color1d hover:underline'>Terms and Conditions</a> and <a href={PageLinks.privacyPolicy} target="_blank" className='text-color1d hover:underline'>Privacy Policy</a>.</p>
                        </div>
                    </div>
                </div>
                <div className='hidden md:block'>
                    <img className='w-full h-full' src='/images/banner/signup.jpg' />
                </div>
            </div>
        </>
    );
}

export default Page