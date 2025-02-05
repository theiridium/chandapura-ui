"use client"
import { userResetPassword } from '@/lib/apiLibrary';
import { Button, Input, Link } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import Image from 'next/image';

const Page = () => {
  const searchParams = useSearchParams();
  const resetCode: any = searchParams.get('code');
  const [payload, setPayload] = useState<User.PasswordReset>({
    password: "",
    passwordConfirmation: "",
    code: resetCode,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const isPasswordMatch = useMemo(() => {
    if (payload.passwordConfirmation === "") return true;
    return (payload.passwordConfirmation === payload.password) ? true : false;
  }, [payload.passwordConfirmation]);
  const resetPassword = async () => {
    setIsLoading(true);
    const res = await userResetPassword(payload);
    if (!!res && res.ok) {
      setIsResetSuccess(true);
    }
    else toast.error(res?.error);
    setIsLoading(false);
  }
  return (
    <div className='max-w-screen-md mx-auto py-10'>
      <div className='text-xl md:text-3xl mb-5 text-center'>Password Reset</div>
      <div className='px-5 py-12 md:px-3 mt-3 lg:my-6 bg-color2d/30'>
        <div className='login-form text-center'>
          {!isResetSuccess && <>
            <Input className='text-login-form mb-5' radius='sm' type="password" variant="flat" label="Enter your new password"
              onChange={(e) => { setPayload((prev) => ({ ...prev, password: e.target.value })) }}
              value={payload.password}
              validate={(val) => {
                if (!val) return "Password is required.";
                if (val.length < 8) return "Password must be at least 8 characters.";
                if (val.length > 15) return "Password must not exceed 15 characters.";
                return null; // No error
              }}
            />
            <Input className='text-login-form mb-5' radius='sm' type="password" variant="flat" label="Re-Enter your password"
              onChange={(e) => { setPayload((prev) => ({ ...prev, passwordConfirmation: e.target.value })) }}
              value={payload.passwordConfirmation}
              validate={() => {
                if (!isPasswordMatch) return "Password does not match.";
                return null; // No error
              }} />
            <div >
              <Button onPress={() => resetPassword()} isLoading={isLoading} className='btn-login-form !mx-auto' color='primary' type='submit' isDisabled={!payload.passwordConfirmation || !isPasswordMatch}>Submit</Button>
            </div>
            <div className='text-remember-pass mt-5'>Remembered your password? <a href='/login' className='text-color1d cursor-pointer hover:underline'>Log in here</a></div>
          </>}
          {isResetSuccess && <>
            <div className='w-full md:w-3/4 mx-auto text-left mb-5'>
              <Image className='m-auto' src={'/images/icons/green-tick.png'} width={128} height={128} alt='Success' />
            </div>
            <p className='w-full md:w-3/4 mx-auto text-left mb-3 text-center'>Your password reset was successful.</p>
            <p className='w-full md:w-3/4 mx-auto text-left mb-5 text-center'>Please continue login with your new password.</p>
            <div >
              <Button as={Link} href='/login' isLoading={isLoading} className='!mx-auto mt-5' radius='sm' color='primary' type='submit'>Click to Login</Button>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}

export default Page