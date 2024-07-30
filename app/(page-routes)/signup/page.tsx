"use client"
import { useState } from 'react'

const Page = (props: any) => {
    return (
        <div className="grid lg:grid-cols-2 h-auto md:min-h-[90vh] md:overflow-auto">
            <div className='grid grid-cols-1 place-content-center my-8'>
                <div className='px-3 md:px-0 w-full md:w-4/5 mx-auto text-center'>
                    <div className='login-form'>
                        <h1 className='text-4xl font-bold mb-8'>Sign up</h1>
                        <p className='text-xl font-semibold color text-gray-400 mb-16'>Some description for user before login</p>
                        <input className='text-login-form mb-5' placeholder='Enter your Name' />
                        <input className='text-login-form mb-5' placeholder='Enter your Email ID' />
                        <input className='text-login-form mb-5' placeholder='Enter your Mobile' />
                        <input className='text-login-form mb-5' placeholder='Password' />
                        <button className='btn-login-form'>CONTINUE</button>
                    </div>
                    <div className='mt-14 mb-10'>
                        <hr className='border-gray-300' />
                        <div className='-mt-3 text-lg'><span className='bg-white px-3 text-gray-500'>OR</span></div>
                    </div>
                    <div className='soc-login mb-8'>
                        <button className='btn-soclogin-form'>Continue with Google</button>
                    </div>
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