import { Button, Input } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { PropertyListing } from '@/lib/typings/dto'
import { MoveLeft, MoveRight } from 'lucide-react'
import { SelectList } from '@/public/shared/app.config'

interface ChildProps {
    propertyListing: PropertyListing
    propertyDetails: any
    setPropertyDetails: React.Dispatch<React.SetStateAction<any>>
    disabled: boolean
    nextStep: () => void
    prevStep: () => void
}

const Pricing: React.FC<ChildProps> = ({
    propertyListing,
    disabled,
    propertyDetails,
    setPropertyDetails,
    nextStep,
    prevStep
}) => {
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)

    // Only required fields control Next button
    useEffect(() => {
        let requiredFilled = true
        if (propertyListing.listing_type === "Rent") {
            requiredFilled =
                !!propertyDetails?.rental_amount &&
                !!propertyDetails?.deposit_amount
        } else if (propertyListing.listing_type === "Sale") {
            requiredFilled = !!propertyDetails?.selling_amount
        }
        setBtnDisabled(!requiredFilled)
    }, [propertyDetails, propertyListing.listing_type])

    const handleChange = (key: string, value: any) => {
        const updatedDetails = { ...propertyDetails, [key]: value }
        setPropertyDetails(updatedDetails)
        sessionStorage.setItem('propertyDetails', JSON.stringify(updatedDetails))
    }

    return (
        <div className="listing-card border rounded-lg px-4 lg:px-7 py-6 shadow-lg min-h-[60vh]">
            <div className="grid h-full content-between">
                <div className="card-header text-xl font-semibold mb-5">
                    Add your property pricing
                </div>

                {/* Rent Section */}
                {propertyListing?.listing_type === "Rent" && (
                    <div className="flex flex-wrap md:flex-nowrap gap-8 lg:gap-4 mb-8">
                        <Input
                            isDisabled={disabled}
                            value={propertyDetails?.rental_amount?.toString() || ""}
                            onChange={(e: any) => handleChange('rental_amount', e.target.value)}
                            type="number"
                            variant="flat"
                            label="Rental Amount (Monthly)"
                            startContent={<span className="text-default-400 text-small">₹</span>}
                            isRequired
                        />
                        <Input
                            isDisabled={disabled}
                            value={propertyDetails?.deposit_amount?.toString() || ""}
                            onChange={(e: any) => handleChange('deposit_amount', e.target.value)}
                            type="number"
                            variant="flat"
                            label="Security Deposit Amount"
                            startContent={<span className="text-default-400 text-small">₹</span>}
                            isRequired
                        />
                    </div>
                )}

                {/* Sale Section */}
                {propertyListing?.listing_type === "Sale" && (
                    <div className="flex flex-wrap md:flex-nowrap gap-8 lg:gap-4 mb-8">
                        <Input
                            isDisabled={disabled}
                            value={propertyDetails?.selling_amount?.toString() || ""}
                            onChange={(e: any) => handleChange('selling_amount', e.target.value)}
                            type="number"
                            variant="flat"
                            label="Selling Amount"
                            startContent={<span className="text-default-400 text-small">₹</span>}
                            isRequired
                        />
                    </div>
                )}

                {/* PG Section */}
                {propertyListing?.listing_type === "PG" &&
                    <>
                        {/* <div className='mb-5 text-sm md:text-base'>Occupancy Based Rent Per Month</div> */}
                        <div className='grid grid-cols-2 md:grid-cols-4 content-center gap-y-5 md:gap-y-0 gap-x-5'>
                            {SelectList.OccupancyType.map((x: any, i: any) =>
                                <div key={i} className={`p-5 border border-color1d/30 col-span-auto w-full h-full rounded-xl flex flex-col items-center justify-center
                                                         ${!!propertyDetails?.occupancy_type?.[x.name]?.toString() && propertyDetails?.occupancy_type?.[x.name] > 0 && ' bg-color1d/30'}`}>
                                    <div>{x.label}</div>
                                    <input disabled={disabled}
                                        className='text-center bg-transparent'
                                        value={propertyDetails?.occupancy_type?.[x.name]?.toString() || ""}
                                        onChange={(e: any) =>
                                            setPropertyDetails((prev: any) => ({
                                                ...prev,
                                                occupancy_type: {
                                                    ...prev.occupancy_type,
                                                    [x.name]: e.target.value || null
                                                },
                                            }))
                                        }
                                        type="number"
                                        placeholder={`Enter amount`} />
                                </div>
                            )}
                        </div>
                    </>
                }

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        color="primary"
                        variant="flat"
                        size="md"
                        radius="sm"
                        startContent={<MoveLeft />}
                        onPress={prevStep}
                    >
                        Prev
                    </Button>
                    <Button
                        isDisabled={btnDisabled}
                        color="primary"
                        variant="flat"
                        size="md"
                        radius="sm"
                        endContent={<MoveRight />}
                        onPress={nextStep}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Pricing
