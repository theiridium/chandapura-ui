"use client"
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/react';
import { useState } from 'react';

const Page = () => {
    const router = useRouter();
    const [txtcode, setTxtCode] = useState("");
    const [promoValMsg, setpromoValMsg] = useState("");
    const [disablePromo, setDisablePromo] = useState(false);
    const [promoValBtnTxt, setPromoValBtnTxt] = useState("Validate");
    const handlePromoCodeChange = (e: any) => setTxtCode(e.target.value);
    const handlePromoValidation = (type: string) => {
        setpromoValMsg("You are eligible for free business listing");
        type === "Edit" ? (
            setPromoValBtnTxt("Validate"),
            setpromoValMsg(""),
            setDisablePromo(false)
        ) :
        (
            setPromoValBtnTxt("Edit"),
            setDisablePromo(true)
        )
    }
    return (
        <>
            <div className='col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-4xl font-bold text-gray-700 px-7'>Payment</div>
                </div>
                <div className='grid grid-cols-1 gap-10'>
                    <div className='listing-card border rounded-lg px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Add your Promo Code</div>
                        <div className='flex gap-x-4'>
                            <Input className='mb-6' type="text" variant="flat" label="Promo Code" readOnly={disablePromo} onChange={(e) => handlePromoCodeChange(e)} value={txtcode} />
                            <button className='btn-primary w-auto rounded-lg mb-5 py-2 px-5 block' onClick={() => handlePromoValidation(promoValBtnTxt)}>{promoValBtnTxt}</button>
                        </div>
                        <div>{promoValMsg}</div>
                    </div>
                    <div className='flex gap-x-5 justify-between text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <button className='btn-primary' onClick={() => router.push('/business-listing/upload-images')}>Previous Step</button>
                        <button className='btn-primary' onClick={() => router.push('/business-listing/publish')}>Continue to Review</button>
                    </div>
                </div>
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
        </>
    )
}

export default Page