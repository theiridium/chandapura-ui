"use client"
import { Resource } from "@/public/shared/app.config";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TextLoading from "../loading-components/text-loading";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { CircleCheckBig, CircleX, IndianRupee } from "lucide-react";

const PaymentCard = ({ adPrice, listingPrice, setAdPrice }: any) => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const pageUrl = searchParams ? `${pathname}?${searchParams}` : `${pathname}`;
    const [isLoading, setIsLoading] = useState(true);
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', options);
    const [listingAmount, setListingAmount] = useState<number>(0);
    const [taxAmount, setTaxAmount] = useState<any>(0);
    const [totalAmount, setTotalAmount] = useState<any>(0);
    const calculateTax = (): number => {
        return ((listingAmount + adPrice.amount) * 18) / 100;
    };

    useEffect(() => {
        setListingAmount(listingPrice.amount);
    }, [listingPrice])

    useEffect(() => {
        const tax = calculateTax();
        setTaxAmount(tax);
        setTotalAmount(listingAmount + adPrice.amount + tax);
    }, [listingPrice, adPrice, listingAmount])

    const removeAdAmount = () => setAdPrice({ ...adPrice, amount: 0 });

    const onClickApplyPromo = () => {
        setListingAmount(0);
    }

    return (
        <div className="border rounded-lg bg-white px-7 py-6 lg:sticky lg:top-[6.5rem]">
            <div className='card-header text-xl font-semibold mb-5'>Order Summary</div>
            <div className='mb-8 flex justify-between'>
                <div>
                    <div className='text-sm mb-1 font-semibold'>Customer Name</div>
                    <div className='text-lg'>{userData.name}</div>
                </div>
                <div>
                    <div className='text-sm mb-1 font-semibold'>Billing Date</div>
                    <div className='text-lg'>{formattedDate}</div>
                </div>
            </div>
            {/* <div className="mb-8 border-2 border-transparent hover:border-color1d bg-color1d/10 p-3"> */}
            <div className={`mb-8 border-2 ${listingAmount ? 'border-transparent' : 'border-color1d'} hover:border-color1d bg-color1d/10 p-3`}>
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-sm">Promotional Offer</div>
                        <div className="text-xs font-semibold">Free listing until 3rd Jan, 2025</div>
                    </div>
                    <Button className="pointer-cursor" radius="sm" size="sm" color={listingAmount ? "primary" : "success"} variant="flat" onClick={() => onClickApplyPromo()}>{listingAmount ? "Apply" : "Applied"}</Button>
                </div>
            </div>
            <div className='divide-y *:py-4'>
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Business Listing Plan</div>
                        <div>{listingPrice.type}</div>
                    </div>
                    <div className="flex">
                        {!listingAmount && <div className="text-xl flex items-center mr-2"><IndianRupee size={18} /><span className="line-through decoration-slate-500/60">{listingPrice.amount}</span></div>}
                        <div className="text-xl flex items-center"><IndianRupee size={18} />{listingAmount}</div>
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Advertisement Plan</div>
                        <div>{adPrice.type}</div>
                    </div>
                    <div className="text-xl flex items-center relative"><IndianRupee size={18} />
                        {adPrice.amount}
                        {adPrice.amount > 0 && <button className="absolute -right-5" onClick={() => removeAdAmount()}><CircleX size={16} color="#650081" /></button>}
                    </div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='text-sm mb-1 font-semibold'>Taxes & Fees</div>
                    <div className="text-xl flex items-center"><IndianRupee size={18} />{taxAmount}</div>
                </div>
                <div className='flex justify-between items-center'>
                    <div className='text-xl mb-1 font-semibold'>Total</div>
                    <div className="text-xl flex items-center"><IndianRupee size={18} />{totalAmount}</div>
                </div>
            </div>
            {totalAmount > 0 && <div className="flex justify-end mt-5">
                <Button radius="none" size="md" color="primary" variant="ghost">Checkout</Button>
            </div>}
        </div>
    )
}

export default PaymentCard