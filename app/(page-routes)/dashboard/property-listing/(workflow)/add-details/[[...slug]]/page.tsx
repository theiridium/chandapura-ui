"use client"
import { Autocomplete, AutocompleteItem, Button, Chip, Input, RadioGroup, Select, SelectedItems, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from '@nextui-org/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactForm from '@/app/components/forms/contact-form';
import { ContactComponent, PropertyListing } from '@/lib/typings/dto';
import { useAtomValue } from 'jotai';
import { areas, amenities } from '@/lib/atom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { Products, SelectList } from '@/public/shared/app.config';
import FormLoading from '@/app/loading-components/form-loading';
import { toast } from 'react-toastify';
import AddLocationMap from '@/app/components/maps/add-location-map';
import { RadioBox } from '@/app/sub-components/radio-box';
import { ListingWorkflow } from '@/lib/typings/enums';

const Page = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [disabled, setDisabled] = useState(true);
    const amenityList = useAtomValue<any>(amenities).data;
    const areaList = useAtomValue<any>(areas).data;
    const [contact, setContact] = useState<ContactComponent>({
        contact_name: userData.name,
        contact_number: userData.phone,
        contact_email_id: userData.email
    });
    const [location, setLocation] = useState<any>({
        geohash: "",
        coordinates: { lat: 12.802076618635756, lng: 77.70497166549252 }
    });
    const [isExistingLoc, setIsExistingLoc] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [propertyListing, setPropertyListing] = useState<PropertyListing>({
        listing_type: "",
        property_type: "",
        room_type: "",
        area: "",
        full_address: "",
        name: "",
        description: "",
        contact: contact,
        gallery_images: [],
        featured_image: {},
        step_number: ListingWorkflow.Initial,
        location: location,
        amenities: [],
        property_details: {
            bathrooms: 0,
            direction: "",
            floor_number: 0,
            total_floors: 0,
            carpet_area: 0,
            parking_type: "",
            landmark: "",
            rental_amount: 0,
            selling_amount: 0,
            deposit_amount: 0,
            furnishing: "",
        }
    });
    const [apiRes, setApiRes] = useState<any>();
    const onAreaChange = (id: any) => setPropertyListing({ ...propertyListing, area: id });

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);


    useEffect(() => {
        if (apiRes) {
            setContact(apiRes.contact)
            setLocation(apiRes.location);
            setIsExistingLoc(true);
            setPropertyListing({
                ...apiRes,
                area: apiRes.area.id?.toString(),
                contact: apiRes.contact,
                location: apiRes.location,
                amenities: apiRes.amenities?.map((item: any) => item.id.toString()) || []
            });
        }
    }, [apiRes])

    const populateBusinessDetails = useCallback(async () => {
        if (source) {
            const attr = Products.realEstate.api;
            let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
            const response = await getPublicApiResponse(apiUrl).then(res => res.data);
            const data = response[0];
            if (data) {
                setApiRes(data);
                setDisabled(false);
                return data;
            }
            else window.location.replace('/');
        }
        else setDisabled(false)
    }, [source])

    //on form submit
    const {
        register,
        handleSubmit,
        reset,
        control
    } = useForm<any>({
        defaultValues: async () => populateBusinessDetails()
    });

    const handleContactDetails = (data: any) => setContact(data);
    const handleLocation = (data: any) => setLocation(data);

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        let formdata = { ...data, propertyListing }
        const payload: PropertyListing = {
            ...propertyListing,
            name: formdata.name,
            full_address: formdata.full_address,
            description: formdata.description,
            room_type: formdata.room_type,
            contact: contact,
            step_number: ListingWorkflow.AddDetails,
            location: location,
        }
        postPropertyListing(payload);
    }

    const postPropertyListing = async (payload: any) => {
        console.log(payload)
        const endpoint = Products.realEstate.api.base;
        if (type === "edit" || type === "edit_back") {
            const response = await putRequestApi(endpoint, payload, source);
            console.log(response);
            if (response.data) {
                toast.success("Property details saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/property-listing/upload-images?type=new&source=${response.data.id}`);
                else {
                    toast.info("Redirecting to listing menu...")
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    router.push(`/dashboard/property-listing/view-all`)
                }
            }
        }
        else {
            const response = await postRequestApi(endpoint, payload);
            console.log(response);
            if (response.data) {
                toast.success("Property details saved successfully!");
                router.push(`/dashboard/property-listing/upload-images?type=${type}&source=${response.data.id}`);
            }
        }
    }
    // useEffect(() => {
    //     console.log(propertyListing)
    // }, [propertyListing])

    const onKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Uploading your Property Details..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Property Details" : "Add New Property"}</div>
                </div>
                <form onKeyPress={onKeyPress} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className='mb-8'>
                            <RadioGroup
                                value={propertyListing.listing_type}
                                onChange={(e: any) => setPropertyListing({ ...propertyListing, listing_type: e.target.value })}
                                orientation="horizontal"
                                label="Listing Type"
                                description="Listing type cannot be changed once its published."
                                isDisabled={!!source || disabled}
                                isRequired>
                                <RadioBox value="Rent">
                                    For Rent
                                </RadioBox>
                                <RadioBox value="Sale">
                                    For Sale
                                </RadioBox>
                            </RadioGroup>
                        </div>
                        <div className='mb-8'>
                            <Select label="Select a Property Type" selectedKeys={[propertyListing.property_type]} isDisabled={disabled}
                                onChange={(e: any) => setPropertyListing({ ...propertyListing, property_type: e.target.value })}
                                isRequired>
                                {SelectList.PropertyType.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex w-full gap-4 mb-8">
                            <Controller
                                control={control}
                                name='room_type'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("room_type")}
                                        value={value || ""}
                                        type="text"
                                        variant="flat"
                                        label="Room Type"
                                        className='basis-1/2 lg:basis-1/3'
                                        placeholder='2BHK'
                                        isRequired />
                                )}
                            />
                            <Controller
                                control={control}
                                name='name'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("name")}
                                        value={value || ""}
                                        type="text"
                                        variant="flat"
                                        label="Property Name"
                                        isRequired />
                                )}
                            />
                        </div>
                        <div className='mt-3 mb-8'>
                            <Controller
                                control={control}
                                name='description'
                                render={({ field: { value } }) => (
                                    <Textarea isDisabled={disabled}
                                        {...register("description")}
                                        value={value || ""}
                                        variant="flat"
                                        label="Description" />
                                )}
                            />
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='propertyDetails' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Property Details</div>
                        <div className='flex w-full gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={propertyListing.property_details.carpet_area?.toString() || ""}
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            carpet_area: e.target.value,
                                        },
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
                            <Select label="Direction" selectedKeys={[propertyListing.property_details.direction]}
                                isDisabled={disabled}
                                isRequired
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            direction: e.target.value,
                                        },
                                    }))
                                }>
                                {SelectList.Direction.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Number of Bathrooms" selectedKeys={[propertyListing.property_details.bathrooms?.toString() || "1"]}
                                isDisabled={disabled}
                                isRequired
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            bathrooms: e.target.value,
                                        },
                                    }))
                                }>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <SelectItem key={i}>
                                        {(i + 1).toString()}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex w-full gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            {propertyListing.property_type === "Apartment" ?
                                <Input isDisabled={disabled}
                                    value={propertyListing.property_details.floor_number?.toString() || ""}
                                    onChange={(e: any) =>
                                        setPropertyListing((prev) => ({
                                            ...prev,
                                            property_details: {
                                                ...prev.property_details,
                                                floor_number: e.target.value,
                                            },
                                        }))
                                    }
                                    type="number"
                                    variant="flat"
                                    label="Floor Number"
                                    isRequired /> :
                                <Input isDisabled={disabled}
                                    value={propertyListing.property_details.total_floors?.toString() || ""}
                                    onChange={(e: any) =>
                                        setPropertyListing((prev) => ({
                                            ...prev,
                                            property_details: {
                                                ...prev.property_details,
                                                total_floors: e.target.value,
                                            },
                                        }))
                                    }
                                    type="number"
                                    variant="flat"
                                    label="Total floors"
                                    isRequired />
                            }
                            <Select label="Furnishing" selectedKeys={[propertyListing.property_details.furnishing]}
                                isDisabled={disabled}
                                isRequired
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            furnishing: e.target.value,
                                        },
                                    }))
                                }>
                                {SelectList.Furnishhing.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Parking Type" selectedKeys={[propertyListing.property_details.parking_type]}
                                isDisabled={disabled}
                                isRequired
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            parking_type: e.target.value,
                                        },
                                    }))
                                }>
                                {SelectList.ParkingType.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='mb-8'>
                            <Select
                                items={amenityList || []}
                                variant="flat"
                                label="Amenities"
                                isMultiline={true}
                                selectionMode="multiple"
                                placeholder="Select amenities"
                                classNames={{
                                    base: "w-full",
                                    trigger: "min-h-12 py-2",
                                }}
                                selectedKeys={propertyListing.amenities}
                                isDisabled={disabled}
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        amenities: e.target.value.split(","),
                                    }))
                                }
                                renderValue={(items: SelectedItems<any>) => {
                                    return (
                                        <div className="flex flex-wrap gap-2">
                                            {items.map((item) => (
                                                <Chip key={item.key}>{item.data.name}</Chip>
                                            ))}
                                        </div>
                                    );
                                }}
                            >
                                {(item) => (
                                    <SelectItem key={item.id}>
                                        {item.name}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className='mb-8'>
                            <Input isDisabled={disabled}
                                value={propertyListing.property_details.landmark || ""}
                                onChange={(e: any) =>
                                    setPropertyListing((prev) => ({
                                        ...prev,
                                        property_details: {
                                            ...prev.property_details,
                                            landmark: e.target.value,
                                        },
                                    }))
                                }
                                type="text"
                                variant="flat"
                                label="Landmark (Optional)" />
                        </div>
                        <div className='flex w-full gap-4 mb-8 flex-wrap md:flex-nowrap'>
                            {propertyListing.listing_type === "Rent" ?
                                <>
                                    <Input isDisabled={disabled}
                                        value={propertyListing.property_details.rental_amount?.toString() || ""}
                                        onChange={(e: any) =>
                                            setPropertyListing((prev) => ({
                                                ...prev,
                                                property_details: {
                                                    ...prev.property_details,
                                                    rental_amount: e.target.value,
                                                },
                                            }))
                                        }
                                        type="number"
                                        variant="flat"
                                        label="Rental Monthly Amount"
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">₹</span>
                                            </div>
                                        }
                                        isRequired />
                                    <Input isDisabled={disabled}
                                        value={propertyListing.property_details.deposit_amount?.toString() || ""}
                                        onChange={(e: any) =>
                                            setPropertyListing((prev) => ({
                                                ...prev,
                                                property_details: {
                                                    ...prev.property_details,
                                                    deposit_amount: e.target.value,
                                                },
                                            }))
                                        }
                                        type="number"
                                        variant="flat"
                                        label="Deposit Amount"
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">₹</span>
                                            </div>
                                        }
                                        isRequired />
                                </> :
                                <Input isDisabled={disabled}
                                    value={propertyListing.property_details.selling_amount?.toString() || ""}
                                    onChange={(e: any) =>
                                        setPropertyListing((prev) => ({
                                            ...prev,
                                            property_details: {
                                                ...prev.property_details,
                                                selling_amount: e.target.value,
                                            },
                                        }))
                                    }
                                    type="number"
                                    variant="flat"
                                    label="Selling Amount"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">₹</span>
                                        </div>
                                    }
                                    isRequired />
                            }
                        </div>
                    </InView>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='location' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Location</div>
                        <div className="mb-8">
                            <Autocomplete
                                variant="flat"
                                defaultItems={areaList || []}
                                label="Select an Area"
                                onSelectionChange={onAreaChange}
                                isDisabled={disabled}
                                selectedKey={propertyListing.area}
                                isRequired
                            >
                                {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                        <div className='mt-3 mb-8'>
                            <Controller
                                control={control}
                                name='full_address'
                                render={({ field: { value } }) => (
                                    <Textarea isDisabled={disabled}
                                        {...register("full_address")}
                                        value={value || ""}
                                        variant="flat"
                                        label="Full Address"
                                        isRequired />
                                )}
                            />
                        </div>
                        <div className='mb-6'>
                            <AddLocationMap setLocation={handleLocation} location={location} isExistingLoc={isExistingLoc} />
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Property Contact Details</div>
                        <ContactForm txtContactDisabled={disabled} defaultContact={contact} contactDetails={handleContactDetails} />
                    </InView>
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        <Button className='btn-primary text-base' color='primary' type='submit' isLoading={isSubmitLoading}>
                            {!isSubmitLoading && ((type === "edit") ? "Save" : "Save and Continue")}
                        </Button>
                    </div>
                </form>
            </div>
            <div className='hidden lg:block col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>
                    <a className={`${activeEl === 'general' && 'active'}`} href='#general'>General</a>
                    <a className={`${activeEl === 'propertyDetails' && 'active'}`} href='#propertyDetails'>Property Details</a>
                    <a className={`${activeEl === 'location' && 'active'}`} href='#location'>Location</a>
                    <a className={`${activeEl === 'contact' && 'active'}`} href='#contact'>Contact</a>
                </div>
            </div>
        </>
    )
}

export default Page