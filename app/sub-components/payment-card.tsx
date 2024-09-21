"use client"
import { Products, Resource } from "@/public/shared/app.config";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TextLoading from "../loading-components/text-loading";
import { useEffect, useState } from "react";
import { Button, Link } from "@nextui-org/react";
import { CircleCheckBig, CircleX, IndianRupee } from "lucide-react";
import { convertToReadableDate, hashCode } from "@/lib/helpers";
import Script from "next/script";
import { createOrderId, putRequestApi } from "@/lib/apiLibrary";
import { toast } from "react-toastify";
import RazorpayButton from "./razorpay-button";

const PaymentCard = ({ pricing, expiryDate, paymentData, hasSubscribed, setHasSubscribed, isOfferApplicable }: any) => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const pageUrl = searchParams ? `${pathname}?${searchParams}` : `${pathname}`;
    const [isLoading, setIsLoading] = useState(false);
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    const currentDate = new Date();
    const [listingAmount, setListingAmount] = useState<number>(pricing.amount);
    const [taxAmount, setTaxAmount] = useState<any>(0);
    const [isOfferApplied, setIsOfferApplied] = useState<boolean>(false);
    // const [noPaymentRequired, setNoPaymentRequired] = useState(false);
    const [totalAmount, setTotalAmount] = useState<any>(0);
    const calculateTax = (): number => {
        return (listingAmount * 18) / 100;
    };
    useEffect(() => {
        setListingAmount(pricing.amount);
        setIsOfferApplied(false);
    }, [pricing])

    useEffect(() => {
        const tax = calculateTax();
        setTaxAmount(tax);
        setTotalAmount((listingAmount + tax).toFixed(2));
    }, [listingAmount]);

    const onClickApplyPromo = () => {
        setIsOfferApplied(true);
        setListingAmount(0);
    };

    const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isPaymentSuccess = false;
        try {
            setIsLoading(true);
            if (totalAmount > 0) {
                const hash = hashCode(currentDate.toString())
                const receiptId = `rcp_${currentDate.getTime().toString(36)}${hash}`;
                const orderId: string = await createOrderId(totalAmount, receiptId);
                const options = {
                    key: process.env.RAZORPAY_API_KEY_ID,
                    amount: parseFloat(totalAmount) * 100,
                    currency: 'INR',
                    name: userData.name,
                    description: 'description',
                    order_id: orderId,
                    handler: async function (response: any) {
                        const data = {
                            orderCreationId: orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        };

                        const result = await fetch('/api/verify', {
                            method: 'POST',
                            body: JSON.stringify(data),
                            headers: { 'Content-Type': 'application/json' },
                        });
                        const res = await result.json();
                        if (res.isOk) {
                            toast.success("Payment completed successfully!");
                            isPaymentSuccess = await savePaymentDetails(data);
                            if (isPaymentSuccess) setHasSubscribed(true);
                            setIsLoading(false);
                        }
                        else {
                            alert(res.message);
                        }
                    },
                    prefill: {
                        name: userData.name,
                        email: userData.email,
                    },
                    theme: {
                        color: '#650081',
                    },
                };
                const paymentObject = new window.Razorpay(options);
                paymentObject.on('payment.failed', function (response: any) {
                    alert(response.error.description);
                });
                paymentObject.open();
                setIsLoading(false);
            }
            else {
                const data = {
                    orderCreationId: null,
                    razorpayPaymentId: null,
                    razorpayOrderId: null,
                    razorpaySignature: null
                };
                isPaymentSuccess = await savePaymentDetails(data);
                if (isPaymentSuccess) {
                    setHasSubscribed(true);
                    toast.success(`You have unlocked free listing untill ${convertToReadableDate(new Date(expiryDate))}. Please continue to Preview.`);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const savePaymentDetails: any = async (data: any) => {
        try {
            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/advertisement/view-all`)
            }
            else if (type === "new" || type === "edit_back") {
                let payment_details = {
                    purchase_date: currentDate.toISOString(),
                    amount: totalAmount,
                    expiry_date: expiryDate,
                    raz_order_id: data.razorpayOrderId,
                    raz_payment_id: data.razorpayPaymentId,
                    isPaymentSuccess: true,
                    isOfferApplied: isOfferApplied
                }
                let payload = {
                    payment_details: payment_details,
                    payment_history: [...paymentData.payment_history, payment_details]
                }
                const endpoint = Products.advertisement.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Payment details saved successfully!");
                    return true;
                }
                else {
                    toast.error("Could not save your payment details. Please contact the support.");
                    return false;
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload payment details.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="border rounded-lg bg-white px-7 py-6 lg:sticky lg:top-[6.5rem]">
                <div className='card-header text-xl font-semibold mb-5'>Order Summary</div>
                <div className='mb-8 flex justify-between'>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Customer Name</div>
                        <div className='text-lg'>{userData.name}</div>
                    </div>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Billing Date</div>
                        <div className='text-lg'>{convertToReadableDate(currentDate)}</div>
                    </div>
                </div>
                {/* <div className="mb-8 border-2 border-transparent hover:border-color1d bg-color1d/10 p-3"> */}
                {isOfferApplicable && !hasSubscribed && <div className={`mb-8 border-2 border-dashed ${!isOfferApplied ? 'border-transparent' : 'border-color1d'} hover:border-color1d bg-color1d/10 p-3`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm">Promotional Offer</div>
                            <div className="text-xs font-semibold">Free listing until {convertToReadableDate(new Date(expiryDate))}</div>
                        </div>
                        <Button className="pointer-cursor" radius="sm" size="sm" color={!isOfferApplied ? "primary" : "success"} variant="flat" onClick={() => onClickApplyPromo()}>{!isOfferApplied ? "Apply" : "Applied"}</Button>
                    </div>
                </div>}
                <div className='divide-y *:py-4'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <div className='text-sm mb-1 font-semibold'>Business Listing Plan</div>
                            {!isOfferApplied ? <div>{pricing.type}</div> : <div>Promotional</div>}
                            {isOfferApplied && <div className="text-xs font-semi-bold">Expires on {convertToReadableDate(new Date(expiryDate))}</div>}
                        </div>
                        <div className="flex">
                            {isOfferApplied && <div className="text-xl flex items-center mr-2"><IndianRupee size={18} /><span className="line-through decoration-slate-500/60">{pricing.amount}</span></div>}
                            <div className="text-xl flex items-center"><IndianRupee size={18} />{listingAmount}</div>
                        </div>
                    </div>
                    {/* <div className='flex justify-between items-center'>
                        <div>
                            <div className='text-sm mb-1 font-semibold'>Advertisement Plan</div>
                            <div>{adPrice.type}</div>
                        </div>
                        <div className="text-xl flex items-center relative"><IndianRupee size={18} />
                            {adPrice.amount}
                            {adPrice.amount > 0 && <button className="absolute -right-5" onClick={() => removeAdAmount()}><CircleX size={16} color="#650081" /></button>}
                        </div>
                    </div> */}
                    <div className='flex justify-between items-center'>
                        <div className='text-sm mb-1 font-semibold'>Taxes & Fees</div>
                        <div className="text-xl flex items-center"><IndianRupee size={18} />{taxAmount}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='text-xl mb-1 font-semibold'>Total</div>
                        <div className="text-xl flex items-center"><IndianRupee size={18} />{totalAmount}</div>
                    </div>
                </div>
                <div className="flex justify-end mt-5">
                    <Button isLoading={isLoading} radius="none" isDisabled={hasSubscribed} size="md" color={`${hasSubscribed ? 'success' : 'primary'}`} variant={`${hasSubscribed ? 'solid' : 'ghost'}`} onClick={(e: any) => processPayment(e)}>{hasSubscribed ? 'Paid' : 'Checkout'}</Button>
                    {/* <Button as={Link} href="https://rzp.io/l/8IapPlGi" radius="none" size="md" color="primary" variant="ghost">Checkout</Button> */}
                    {/* <RazorpayButton /> */}
                </div>
            </div>
        </>
    )
}

export default PaymentCard