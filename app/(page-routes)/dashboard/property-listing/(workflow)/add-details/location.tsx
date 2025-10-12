import AddLocationMap from '@/app/components/maps/add-location-map'
import { Autocomplete, AutocompleteItem, Button, Input, Textarea } from '@heroui/react'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Control, Controller, UseFormRegister } from 'react-hook-form'
import { areas } from '@/lib/atom';
import { PropertyListing } from '@/lib/typings/dto'
import { MoveLeft, MoveRight } from 'lucide-react'

interface ChildProps {
    propertyListing: PropertyListing
    setPropertyListing: React.Dispatch<React.SetStateAction<PropertyListing>>
    disabled: boolean
    control: Control<PropertyListing>
    register: UseFormRegister<PropertyListing>
    watch: any
    isExistingLoc: boolean
    location: any
    setLocation: React.Dispatch<React.SetStateAction<any>>
    nextStep: () => void
    prevStep: () => void
}

const Location: React.FC<ChildProps> = ({
    propertyListing,
    setPropertyListing,
    disabled,
    control,
    register,
    watch,
    isExistingLoc,
    location,
    setLocation,
    nextStep,
    prevStep
}) => {
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true)
    const areaList = useAtomValue<any>(areas).data

    const nameValue = watch('name')
    const fullAddressValue = watch('full_address')

    // Enable Next button only if required fields are filled
    useEffect(() => {
        const requiredFilled =
            !!propertyListing.area &&
            !!nameValue?.trim() &&
            !!fullAddressValue?.trim()

        setBtnDisabled(!requiredFilled)
    }, [propertyListing.area, nameValue, fullAddressValue])

    const onAreaChange = (id: any) => {
        setPropertyListing({ ...propertyListing, area: id })
    }

    const handleLocation = (data: any) => {
        setLocation(data)
    }

    return (
        <div className='listing-card border rounded-lg px-4 lg:px-7 py-6 shadow-lg min-h-[60vh]'>
            <div className='grid h-full content-between'>
                <div className='card-header text-xl font-semibold mb-5'>
                    Where is your property located?
                </div>

                <div className="mb-8">
                    <Autocomplete
                        variant="flat"
                        defaultItems={areaList || []}
                        label="Select your Area"
                        onSelectionChange={onAreaChange}
                        isDisabled={disabled}
                        selectedKey={propertyListing?.area}
                        classNames={{ listboxWrapper: "nextui-listbox" }}
                        isRequired
                    >
                        {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                    </Autocomplete>
                </div>

                <div className='mt-3 mb-8'>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { value } }) => (
                            <Input
                                isDisabled={disabled}
                                {...register("name", { required: true })}
                                value={value?.toUpperCase() || ""}
                                type="text"
                                variant="flat"
                                label="Enter Society/Locality or Building Name"
                                isRequired
                            />
                        )}
                    />
                </div>

                <div className='mt-3 mb-8'>
                    <Controller
                        control={control}
                        name='full_address'
                        render={({ field: { value } }) => (
                            <Textarea
                                isDisabled={disabled}
                                {...register("full_address", { required: true })}
                                value={value || ""}
                                variant="flat"
                                label="Full Address"
                                isRequired
                            />
                        )}
                    />
                </div>

                <div className='mb-6'>
                    <AddLocationMap
                        setLocation={handleLocation}
                        location={location}
                        isExistingLoc={isExistingLoc}
                    />
                </div>

                <div className='flex justify-between mt-8'>
                    <Button
                        color="primary"
                        variant="flat"
                        size='md'
                        radius='sm'
                        startContent={<MoveLeft />}
                        onPress={prevStep}
                    >
                        Prev
                    </Button>
                    <Button
                        isDisabled={btnDisabled}
                        color="primary"
                        variant="flat"
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

export default Location
