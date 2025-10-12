import { Button, Chip, Input, Select, SelectedItems, SelectItem, Textarea } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { PropertyListing } from '@/lib/typings/dto'
import { MoveLeft, MoveRight, X } from 'lucide-react'
import { Control, Controller, UseFormRegister } from 'react-hook-form'
import { SelectList } from '@/public/shared/app.config'

interface ChildProps {
    propertyListing: PropertyListing
    setPropertyListing: React.Dispatch<React.SetStateAction<PropertyListing>>
    disabled: boolean
    control: Control<PropertyListing>
    register: UseFormRegister<PropertyListing>
    propertyDetails: any
    setPropertyDetails: React.Dispatch<React.SetStateAction<any>>
    propertyTypeList: any
    amenityList: any
    amenitiesValues: Selection | any
    setAmenitiesValues: React.Dispatch<React.SetStateAction<Selection | any>>
    nextStep: () => void
    prevStep: () => void
}

const PropertyDetails: React.FC<ChildProps> = ({
    propertyListing,
    disabled,
    control,
    register,
    propertyDetails,
    setPropertyDetails,
    propertyTypeList,
    amenityList,
    amenitiesValues,
    setAmenitiesValues,
    nextStep,
    prevStep
}) => {
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)

    // Enable Next button only if required fields are filled
    useEffect(() => {
        let valid = true;

        // CASE 1: Non-PG and Non-Plot properties (Apartment, IndividualHouse, Villa, etc.)
        if (
            propertyListing.listing_type !== propertyTypeList.Pg &&
            propertyListing.property_type !== propertyTypeList.Plot
        ) {
            valid =
                !!propertyDetails?.room_type &&
                !!propertyDetails?.bathrooms &&
                !!propertyDetails?.carpet_area;
        }

        // CASE 2: Plot type
        if (propertyListing.property_type === propertyTypeList.Plot) {
            valid =
                !!propertyDetails?.dimension ||
                !!propertyDetails?.plot_area; // plot area can also be required for plots
        }

        // CASE 3: PG type (occupancy type should have at least one > 0)
        if (propertyListing.listing_type === propertyTypeList.Pg) {
            valid = true;
        }

        // CASE 4: Villa / IndividualHouse may rely on plot area
        // if (
        //     propertyListing.property_type === propertyTypeList.Villa ||
        //     propertyListing.property_type === propertyTypeList.IndividualHouse
        // ) {
        //     valid = !!propertyDetails?.carpet_area;
        // }

        setBtnDisabled(!valid);
    }, [propertyDetails, propertyListing]);

    const handleChange = (key: string, value: any) => {
        setPropertyDetails((prev: any) => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div className='listing-card border rounded-lg px-4 lg:px-7 py-6 shadow-lg min-h-[60vh]'>
            <div className='grid h-full content-between'>
                <div className='card-header text-xl font-semibold mb-5'>
                    Add more details to get relevant customers
                </div>

                {/* Description */}
                <div className='mt-3 mb-8'>
                    <Controller
                        control={control}
                        name='description'
                        render={({ field: { value } }) => (
                            <Textarea
                                isDisabled={disabled}
                                {...register('description')}
                                value={value || ''}
                                variant='flat'
                                label='Some Description About the Property'
                            />
                        )}
                    />
                </div>

                {/* Unit / Property Details */}
                {propertyListing?.listing_type !== propertyTypeList.Pg &&
                    propertyListing?.property_type !== propertyTypeList.Plot && (
                        <>
                            <div className='card-header text-xl font-semibold my-5'>
                                Unit Details
                            </div>

                            <div className='flex w-full gap-8 lg:gap-4 mb-8 flex-wrap md:flex-nowrap'>
                                <Select
                                    label='Room Type'
                                    selectedKeys={[propertyDetails?.room_type]}
                                    isDisabled={disabled}
                                    onChange={(e: any) => handleChange('room_type', e.target.value)}
                                    classNames={{ listboxWrapper: 'nextui-listbox' }}
                                    isRequired
                                >
                                    {SelectList.RoomType.map((item) => (
                                        <SelectItem key={item}>{item}</SelectItem>
                                    ))}
                                </Select>

                                {propertyListing?.property_type === 'Apartment' ? (
                                    <Input
                                        isDisabled={disabled}
                                        value={propertyDetails?.floor_number?.toString() || ''}
                                        onChange={(e: any) => handleChange('floor_number', e.target.value)}
                                        type='number'
                                        variant='flat'
                                        label='Floor Number'
                                        isRequired
                                    />
                                ) : (
                                    <Select
                                        label='Total Floors'
                                        selectedKeys={[(propertyDetails?.total_floors)?.toString()]}
                                        isDisabled={disabled}
                                        classNames={{ listboxWrapper: 'nextui-listbox' }}
                                        isRequired
                                        onChange={(e: any) => handleChange('total_floors', e.target.value)}
                                    >
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <SelectItem key={i + 1}>{(i + 1).toString()}</SelectItem>
                                        ))}
                                    </Select>
                                )}

                                <Select
                                    label='Number of Bathrooms'
                                    selectedKeys={[(propertyDetails?.bathrooms)?.toString()]}
                                    isDisabled={disabled}
                                    classNames={{ listboxWrapper: 'nextui-listbox' }}
                                    isRequired
                                    onChange={(e: any) => handleChange('bathrooms', e.target.value)}
                                >
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <SelectItem key={i + 1}>{(i + 1).toString()}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                                <Select
                                    label='Direction'
                                    selectedKeys={[propertyDetails?.direction]}
                                    isDisabled={disabled}
                                    classNames={{ listboxWrapper: 'nextui-listbox' }}
                                    isRequired
                                    onChange={(e: any) => handleChange('direction', e.target.value)}
                                >
                                    {SelectList.Direction.map((item) => (
                                        <SelectItem key={item}>{item}</SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label='Furnishing'
                                    selectedKeys={[propertyDetails?.furnishing]}
                                    isDisabled={disabled}
                                    classNames={{ listboxWrapper: 'nextui-listbox' }}
                                    isRequired
                                    onChange={(e: any) => handleChange('furnishing', e.target.value)}
                                >
                                    {SelectList.Furnishhing.map((item) => (
                                        <SelectItem key={item}>{item}</SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label='Parking Type'
                                    selectedKeys={[propertyDetails?.parking_type]}
                                    isDisabled={disabled}
                                    classNames={{ listboxWrapper: 'nextui-listbox' }}
                                    isRequired
                                    onChange={(e: any) => handleChange('parking_type', e.target.value)}
                                >
                                    {SelectList.ParkingType.map((item) => (
                                        <SelectItem key={item}>{item}</SelectItem>
                                    ))}
                                </Select>
                            </div>
                        </>
                    )}

                {/* Area Details */}
                {propertyListing?.listing_type !== propertyTypeList.Pg && propertyListing?.property_type !== propertyTypeList.Plot &&
                    <>
                        <div className='card-header text-xl font-semibold my-5'>Property Area</div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={propertyDetails?.superbuiltup_area?.toString() || ""}
                                onChange={(e: any) =>
                                    setPropertyDetails((prev: any) => ({
                                        ...prev,
                                        superbuiltup_area: e.target.value,
                                    }))
                                }
                                type="number"
                                variant="flat"
                                label="Super Built-Up Area"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">sqft</span>
                                    </div>
                                } />
                            <Input isDisabled={disabled}
                                value={propertyDetails?.builtup_area?.toString() || ""}
                                onChange={(e: any) =>
                                    setPropertyDetails((prev: any) => ({
                                        ...prev,
                                        builtup_area: e.target.value,
                                    }))
                                }
                                type="number"
                                variant="flat"
                                label="Built-Up Area"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">sqft</span>
                                    </div>
                                } />
                            <Input isDisabled={disabled}
                                value={propertyDetails?.carpet_area?.toString() || ""}
                                onChange={(e: any) =>
                                    setPropertyDetails((prev: any) => ({
                                        ...prev,
                                        carpet_area: e.target.value,
                                    }))
                                }
                                type="number"
                                variant="flat"
                                label="Carpet Area"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">sqft</span>
                                    </div>
                                }
                                isRequired />
                        </div>
                    </>
                }
                {(propertyListing?.property_type === propertyTypeList.Plot) &&
                    <>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={propertyDetails?.plot_area?.toString() || ""}
                                onChange={(e: any) =>
                                    setPropertyDetails((prev: any) => ({
                                        ...prev,
                                        plot_area: e.target.value,
                                    }))
                                }
                                endContent={
                                    <div className="flex items-center">
                                        <select
                                            value={propertyDetails?.area_unit?.toString() || "sqft"}
                                            onChange={(e) =>
                                                setPropertyDetails((prev: any) => ({
                                                    ...prev,
                                                    area_unit: e.target.value,
                                                }))
                                            }
                                            className="outline-none border-0 bg-transparent text-default-500"
                                        >
                                            {SelectList.AreaUnit.map((item) => (
                                                <option key={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                }
                                type="number"
                                variant="flat"
                                label="Plot Area"
                                isRequired />
                            <Select
                                label='Direction'
                                selectedKeys={[propertyDetails?.direction]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: 'nextui-listbox' }}
                                isRequired
                                onChange={(e: any) => handleChange('direction', e.target.value)}
                            >
                                {SelectList.Direction.map((item) => (
                                    <SelectItem key={item}>{item}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex w-full gap-1 md:gap-8 lg:gap-4 mt-3 mb-8'>
                            <Input
                                isDisabled={disabled}
                                value={propertyDetails?.dimension_length?.toString() || ''}
                                onChange={(e: any) => handleChange('dimension_length', e.target.value)}
                                type='number'
                                variant='flat'
                                label='Dimension Length'
                            />
                            <X size={60} className='text-default-400' />
                            <Input
                                isDisabled={disabled}
                                value={propertyDetails?.dimension_breadth?.toString() || ''}
                                onChange={(e: any) => handleChange('dimension_breadth', e.target.value)}
                                type='number'
                                variant='flat'
                                label='Dimension Breadth'
                            />
                        </div>
                    </>
                }

                {/* Amenities */}
                <div className='card-header text-xl font-semibold my-5'>
                    Do you provide any amenities?
                </div>
                <div className='mt-3 mb-8'>
                    <Select
                        items={amenityList || []}
                        variant='flat'
                        label='Amenities'
                        isMultiline
                        selectionMode='multiple'
                        placeholder='Select amenities'
                        classNames={{
                            base: 'w-full',
                            trigger: 'min-h-12 py-2',
                            listboxWrapper: 'nextui-listbox relative',
                        }}
                        selectedKeys={amenitiesValues}
                        isDisabled={disabled}
                        onSelectionChange={setAmenitiesValues}
                        renderValue={(items: SelectedItems<any>) => (
                            <div className='flex flex-wrap gap-2'>
                                {items.map((item) => (
                                    <Chip key={item.key}>{item.data.name}</Chip>
                                ))}
                            </div>
                        )}
                    >
                        {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
                    </Select>
                </div>

                {/* Navigation */}
                <div className='flex justify-between mt-8'>
                    <Button
                        color='primary'
                        variant='flat'
                        size='md'
                        radius='sm'
                        startContent={<MoveLeft />}
                        onPress={prevStep}
                    >
                        Prev
                    </Button>
                    <Button
                        isDisabled={btnDisabled}
                        color='primary'
                        variant='flat'
                        size='md'
                        radius='sm'
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

export default PropertyDetails
