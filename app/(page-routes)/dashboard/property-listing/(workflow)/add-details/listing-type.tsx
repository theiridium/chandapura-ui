import { Button, RadioGroup, Select, SelectItem, Selection } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { PropertyListing } from '@/lib/typings/dto'
import { MoveRight } from 'lucide-react'
import { RadioBox } from '@/app/sub-components/radio-box'

interface ChildProps {
    propertyListing: PropertyListing
    setPropertyListing: React.Dispatch<React.SetStateAction<PropertyListing>>
    disabled: boolean
    setAmenitiesValues: React.Dispatch<React.SetStateAction<Selection | any>>
    source: any
    propertyTypeDisabledKeys: any
    propertyTypeList: any
    nextStep: () => void
}

const ListingType: React.FC<ChildProps> = ({
    propertyListing,
    setPropertyListing,
    disabled,
    setAmenitiesValues,
    source,
    propertyTypeDisabledKeys,
    propertyTypeList,
    nextStep
}) => {
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)

    // Enable Next button only if required fields are filled
    useEffect(() => {
        const requiredListingFilled = !!propertyListing.listing_type
        const requiredPropertyFilled =
            propertyListing.listing_type === 'PG' || !!propertyListing.property_type

        setBtnDisabled(!(requiredListingFilled && requiredPropertyFilled))
    }, [propertyListing.listing_type, propertyListing.property_type])

    return (
        <div className="listing-card border rounded-lg px-4 lg:px-7 py-6 shadow-lg min-h-[60vh]">
            <div className="grid h-full content-between">
                <div className="card-header text-xl font-semibold mb-5">
                    What type of property do you want to list?
                </div>

                {/* Listing Type Radio */}
                <div className="mb-8">
                    <RadioGroup
                        value={propertyListing?.listing_type}
                        onChange={(e: any) => {
                            const value = e.target.value
                            setAmenitiesValues(new Set([])) // Reset amenities
                            setPropertyListing((prev: any) => ({
                                ...prev,
                                listing_type: value,
                                property_type: value === 'PG' ? 'PG' : '',
                                details_by_listingtype: []
                            }))
                        }}
                        orientation="horizontal"
                        label="Listing Type"
                        description="Listing type cannot be changed once it's published."
                        isDisabled={!!source || disabled}
                        isRequired
                    >
                        <RadioBox value="Rent">For Rent</RadioBox>
                        <RadioBox value="Sale">For Sale</RadioBox>
                        <RadioBox value="PG">PG</RadioBox>
                    </RadioGroup>
                </div>

                {/* Property Type Dropdown (Skip for PG) */}
                {propertyListing?.listing_type !== 'PG' && (
                    <div className="mb-8">
                        <Select
                            label="Select a Property Type"
                            selectedKeys={[propertyListing?.property_type]}
                            isDisabled={disabled || !propertyListing?.listing_type}
                            onChange={(e: any) =>
                                setPropertyListing((prev) => ({
                                    ...prev,
                                    property_type: e.target.value
                                }))
                            }
                            classNames={{ listboxWrapper: 'nextui-listbox' }}
                            disabledKeys={propertyTypeDisabledKeys}
                            isRequired
                        >
                            {Object.values(propertyTypeList).map((item: any) => (
                                <SelectItem key={item}>{item}</SelectItem>
                            ))}
                        </Select>
                    </div>
                )}

                {/* Next Button */}
                <div className="flex justify-end mt-8">
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

export default ListingType
