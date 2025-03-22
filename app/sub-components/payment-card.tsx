"use client"
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { IndianRupee, MoveRight } from "lucide-react";
import { ConvertToReadableDate, GenerateItemNameForInvoice, GetFreeListingDaysRange, HashCode } from "@/lib/helpers";
import Script from "next/script";
import { createOrderId, putRequestApi } from "@/lib/apiLibrary";
import { toast } from "react-toastify";
import FormLoading from "../loading-components/form-loading";
import { ListingWorkflow } from "@/lib/typings/enums";
import { RazOrderPayload } from "@/lib/typings/dto";
import { useSetAtom } from "jotai";
import { listingFormBtnEl } from "@/lib/atom";
import CouponCard from "./coupon-card";
import PaymentSuccessModal from "../components/modals/payment-success-modal";

const PaymentCard = ({ planDetails, expiryDate, paymentData, hasSubscribed, setHasSubscribed, isOfferApplicable }: any) => {
    const { data }: any = useSession();
    const userData = data?.user;
    const feeListingDaysRange = GetFreeListingDaysRange();
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const pageUrl = searchParams ? `${pathname}?${searchParams}` : `${pathname}`;
    const [isLoading, setIsLoading] = useState(false);
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    const currentDate = new Date();
    const [listingAmount, setListingAmount] = useState<number>(planDetails.amount);
    const [taxAmount, setTaxAmount] = useState<any>(0);
    const [couponCard, setCouponCard] = useState<any>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isOfferApplied, setIsOfferApplied] = useState<boolean>(false); //turn (ON/OFF) offer
    const [expiryTimestamp, setExpiryTimestamp] = useState(new Date(expiryDate).getTime());
    // const [noPaymentRequired, setNoPaymentRequired] = useState(false);
    const [totalAmount, setTotalAmount] = useState<any>(0);
    const calculateTax = (): number => {
        return (listingAmount * 18) / 100;
    };
    useEffect(() => {
        setListingAmount(planDetails.amount);
        if (!paymentData.isFreeListing) setIsOfferApplied(true);
        switch (planDetails.type) {
            case "Monthly":
                setCouponCard({
                    couponCode: "",
                    couponDescription: ""
                })
                break;
            case "Quaterly":
                setCouponCard({
                    couponCode: "EXTRA30",
                    couponDescription: "Get 30 extra days FREE on your quaterly plan! - Offer Limited"
                })
                break;
            case "Halfyearly":
                setCouponCard({
                    couponCode: "EXTRA60",
                    couponDescription: "Get 60 extra days FREE on your half-yearly plan! - Offer Limited"
                })
                break;

            default:
                setCouponCard({
                    couponCode: "EXTRA90",
                    couponDescription: "Get 3 additional months FREE on your yearly plan! - Offer Limited"
                })
                break;
        }
    }, [planDetails])

    useEffect(() => {
        const tax = calculateTax();
        setTaxAmount(tax);
        setTotalAmount((listingAmount + tax).toFixed(2));
    }, [listingAmount]);

    const onClickApplyPromo = () => {
        setIsOfferApplied(true);
        setListingAmount(0);
    };

    useEffect(() => {
        setExpiryTimestamp(new Date(expiryDate).getTime());
    }, [expiryDate]);

    const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        let isPaymentSuccess = false;
        try {
            setIsLoading(true);
            if (totalAmount > 0) {
                const hash = HashCode(currentDate.toString())
                const receiptId = `rcp_${currentDate.getTime().toString(36)}${hash}`;
                const razOrderPayload: RazOrderPayload = {
                    planAmount: planDetails.amount,
                    totalAmount: totalAmount,
                    receiptId: receiptId,
                    planLabel: planDetails.label,
                    propertyData: planDetails.propertyData,
                    subscriptionType: planDetails.type,
                    productName: planDetails.productName,
                    planStartDate: ConvertToReadableDate(new Date()),
                    planExpiryDate: ConvertToReadableDate(new Date(expiryDate)),
                    gst: taxAmount,
                    customerName: userData.name,
                    customerEmail: userData.email,
                    customerPhone: userData.phone,
                    itemName: GenerateItemNameForInvoice(planDetails.label, planDetails.type, planDetails.propertyData)
                }
                const orderId: string = await createOrderId(razOrderPayload);
                const options = {
                    key: process.env.RAZORPAY_API_KEY_ID,
                    amount: Math.round(parseFloat(totalAmount) * 100),
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
            }
            else await savePaymentDetails(null);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const savePaymentDetails: any = async (raz_data: any) => {
        try {
            setIsLoading(true);
            let payment_details = {
                purchase_date: currentDate.toISOString(),
                amount: totalAmount,
                expiry_date: paymentData.isFreeListing ? feeListingDaysRange : expiryDate,
                expiry_date_timestamp: paymentData.isFreeListing ? new Date(feeListingDaysRange).getTime() : expiryTimestamp,
                raz_order_id: raz_data?.razorpayOrderId || null,
                raz_payment_id: raz_data?.razorpayPaymentId || null,
                isPaymentSuccess: true,
                isOfferApplied: isOfferApplied,
                subscription_type: paymentData.isFreeListing ? "Free" : planDetails.type
            }
            let payload = {
                payment_details: payment_details,
                payment_history: Array.isArray(paymentData.payment_history)
                    ? [...paymentData.payment_history, payment_details]
                    : [payment_details],
                step_number: ListingWorkflow.Payment,
                publish_status: false
            }
            const response = await putRequestApi(planDetails.endpoint, payload, source);
            if (response.data) {
                console.log(response.data)
                // toast.success("Payment details saved successfully!");
                setShowSuccessModal(true);
                return true;
            }
            else {
                toast.error("Could not save your payment details. Please contact the support.");
                return false;
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to upload payment details.");
        }
    }

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 items-center justify-end *:w-auto p-2 *:py-2 *:px-5 *:block'>
            {!!planDetails.amount &&
                <div className="!flex items-center gap-2 !p-0">
                    <p className="text-sm md:text-base">Proceed with payment</p>
                    <MoveRight className="hidden md:block" />
                </div>}
            <Button isLoading={isLoading} radius="none" isDisabled={hasSubscribed || !planDetails.type || isLoading} size="md" color={hasSubscribed ? 'success' : 'primary'} variant='solid' onPress={(e: any) => processPayment(e)}>{hasSubscribed ? 'Paid' : 'Checkout'}</Button>
        </div>
    );

    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isLoading, planDetails, hasSubscribed, listingAmount, totalAmount])

    return (
        <>
            {showSuccessModal && <PaymentSuccessModal url={planDetails.dashUrl} />}
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {isLoading && <FormLoading text="Processing your payment... Please do not hit back or close this window." />}
            <div className="border rounded-lg bg-white px-7 py-6 lg:sticky lg:top-[6.5rem] mb-10 lg:mb-0">
                <div className='card-header text-xl font-semibold mb-5'>Order Summary</div>
                <div className='mb-8 flex justify-between'>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Customer Name</div>
                        <div className='text-lg'>{userData.name}</div>
                    </div>
                    <div>
                        <div className='text-sm mb-1 font-semibold'>Billing Date</div>
                        <div className='text-lg'>{ConvertToReadableDate(currentDate)}</div>
                    </div>
                </div>
                {/* <div className="mb-8 border-2 border-transparent hover:border-color1d bg-color1d/10 p-3"> */}
                {isOfferApplicable && !hasSubscribed && !paymentData.isFreeListing && <div className={`mb-8 border-2 border-dashed ${!isOfferApplied ? 'border-transparent' : 'border-color1d'} hover:border-color1d bg-color1d/10 p-3`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-sm">Promotional Offer</div>
                            <div className="text-xs font-semibold">Free listing until {ConvertToReadableDate(new Date(expiryDate))}</div>
                        </div>
                        <Button className="pointer-cursor" radius="sm" size="sm" color={!isOfferApplied ? "primary" : "success"} variant="flat" onPress={() => onClickApplyPromo()}>{!isOfferApplied ? "Apply" : "Applied"}</Button>
                    </div>
                </div>}
                {isOfferApplied && !!planDetails?.amount &&
                    (!!couponCard?.couponCode &&
                        <CouponCard couponCode={couponCard.couponCode} couponDescription={couponCard.couponDescription} />
                    )
                }
                <div className='divide-y *:py-4'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <div className='text-sm mb-1 font-semibold'>{ }</div>
                            {!isOfferApplied ? <div>{planDetails.type + " Subscription" || "Plan Details"}</div> : <div>Promotional</div>}
                            {listingAmount > 0 && <div className="text-xs font-semi-bold">Expires on {ConvertToReadableDate(new Date(expiryDate))}</div>}
                            {isOfferApplied && !!planDetails?.amount && <p className="text-xs mt-2 bg-green-600 text-white w-fit px-1 font-regular">Offer Applied</p>}
                        </div>
                        <div className="flex">
                            {(planDetails.amount < listingAmount) && <div className="text-xl flex items-center mr-2"><IndianRupee size={18} /><span className="line-through decoration-slate-500/60">{planDetails.amount}</span></div>}
                            <div className="text-xl flex items-center"><IndianRupee size={18} />{listingAmount}</div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div>
                            <div className='text-sm mb-1 font-semibold'>GST</div>
                            <div className="text-xs font-semi-bold">18%</div>
                        </div>
                        <div className="text-xl flex items-center"><IndianRupee size={18} />{taxAmount}</div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='text-xl mb-1 font-semibold'>Total</div>
                        <div className="text-xl flex items-center">{paymentData.isFreeListing ? "Free" : <><IndianRupee size={18} />{totalAmount}</>}</div>
                    </div>
                </div>
                {/* <div className="flex justify-end mt-5">
                    <Button isLoading={isLoading} radius="none" isDisabled={hasSubscribed || !planDetails.type || isLoading} size="md" color={hasSubscribed ? 'success' : 'primary'} variant='solid' onPress={(e: any) => processPayment(e)}>{hasSubscribed ? 'Paid' : 'Checkout'}</Button>
                </div> */}
                {/* <Button as={Link} href="https://rzp.io/l/8IapPlGi" radius="none" size="md" color="primary" variant="ghost">Checkout</Button> */}
                {/* <RazorpayButton /> */}
            </div>
        </>
    )
}

export default PaymentCard