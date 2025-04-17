"use client"
import { Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from "@heroui/react"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactForm from '@/app/components/forms/contact-form';
import { BusinessListing, ContactComponent } from '@/lib/typings/dto';
import { useAtomValue } from 'jotai';
import { areas, subCategories } from '@/lib/atom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { Products } from '@/public/shared/app.config';
import TimeList from "@/lib/data/time-list.json";
import { X } from 'lucide-react';
import FormLoading from '@/app/loading-components/form-loading';
import { toast } from 'react-toastify';
import AddLocationMap from '@/app/components/maps/add-location-map';
import { ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';

const Page = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const formRef = useRef<HTMLFormElement>(null);
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [disabled, setDisabled] = useState(true);
    const subCategoryList = useAtomValue<any>(subCategories);
    const areaList = useAtomValue<any>(areas).data;
    const [categoryName, setCategoryName] = useState<any>([]);
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
    const defaultBusinessHours = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ].map((day) => ({
        day,
        open_time: new Set(["09:00 AM"]),
        close_time: new Set(["09:00 PM"]),
        isOpen: false,
    }));
    const [businessHours, setBusinessHours] = useState(defaultBusinessHours);
    const [businessList, setBusinessList] = useState<BusinessListing>({
        area: "",
        name: "",
        full_address: "",
        description: "",
        contact: contact,
        tags: "",
        sub_category: "",
        gallery_images: [],
        category: "",
        website: "",
        services: [],
        bus_hours: businessHours,
        featured_image: {},
        step_number: ListingWorkflow.Initial,
        location: location
    });
    const [apiRes, setApiRes] = useState<any>();
    const onSubCategoryChange = (id: any) => {
        let category = id ? subCategoryList.filter((x: any) => x.id == id)[0].category : null;
        setCategoryName(category?.name || "");
        setBusinessList({ ...businessList, category: category?.id, sub_category: id });
    }
    const onAreaChange = (id: any) => setBusinessList({ ...businessList, area: id });

    //Service
    const [txtService, setTxtService] = useState("");
    const handleServiceChange = (e: any) => setTxtService(e.target.value);
    const onAddServices = () => {
        if (txtService) {
            const list = [...businessList.services,
            ...txtService.split(",").map(item => item.trim()).filter(item => item && /^[a-zA-Z0-9 ]+$/.test(item))];
            setBusinessList({ ...businessList, services: list })
            setTxtService("");
            handleDivClick();
        }
    }
    const onRemoveServices = (e: any, service: string) => {
        e.preventDefault();
        const list = [...businessList.services];
        let index = list.indexOf(service);
        if (index > -1) {
            list.splice(index, 1);
            setBusinessList({ ...businessList, services: list });
        }
    }

    //Business Days
    const handleBusDaysChange = (e: any) => {
        setBusinessHours(prev => prev.map(x =>
            x.day === e.target.name ? { ...x, isOpen: e.target.checked } : x
        ))
    };

    //Business Hours
    const handleBusOpenHrsChange = (e: any, name: string) => {
        setBusinessHours(prev => prev.map(x =>
            x.day === name ? { ...x, open_time: new Set([e.currentKey]) } : x
        ))
    };
    const handleBusCloseHrsChange = (e: any, name: string) => {
        setBusinessHours(prev => prev.map(x =>
            x.day === name ? { ...x, close_time: new Set([e.currentKey]) } : x
        ))
    };

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);

    useEffect(() => {
        if (apiRes) {
            // setCategoryName(apiRes?.category.name)
            // setContact(apiRes.contact)
            // setLocation(apiRes.location);
            // setIsExistingLoc(true);
            setBusinessList(prevBusinessList => ({
                ...prevBusinessList,
                category: apiRes.category.id.toString(),
                sub_category: apiRes.sub_category.id.toString(),
                area: apiRes.area.id.toString(),
                contact: apiRes.contact,
                services: apiRes.services,
                bus_hours: businessHours,
                location: apiRes.location
            }));
        }
    }, [apiRes, businessHours, subCategoryList])

    const populateBusinessDetails = useCallback(async () => {
        if (source) {
            const attr = Products.business.api;
            let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
            const response = await getPublicApiResponse(apiUrl).then(res => res.data);
            const data = response[0];
            if (data) {
                // setApiRes(data);
                setBusinessList(prevBusinessList => ({
                    ...prevBusinessList,
                    category: data.category.id.toString(),
                    sub_category: data.sub_category.id.toString(),
                    area: data.area.id.toString(),
                    contact: data.contact,
                    services: data.services,
                    bus_hours: businessHours,
                    location: data.location
                }));
                setBusinessHours(data.bus_hours);
                setDisabled(false);
                setCategoryName(data?.category.name)
                setContact(data.contact)
                setLocation(data.location);
                setIsExistingLoc(true);
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

    // Function to convert Set to Array and stringify
    const stringifyBusHours = (bus_hours: any) => {
        return bus_hours.map((bhrs: any) => {
            return {
                ...bhrs,
                close_time: Array.from(bhrs.close_time),
                open_time: Array.from(bhrs.open_time)
            }
        });
    };

    const handleContactDetails = (data: any) => setContact(data);
    const handleLocation = (data: any) => setLocation(data);

    const onSubmit: SubmitHandler<any> = (data) => {
        const isBizTimingUpdated = businessList.bus_hours.some((x: any) => x.isOpen);
        if (!isBizTimingUpdated) {
            toast.warn("Update your business timings!");
            return;
        }
        // if (businessList.services.length === 0) {
        //     toast.warn("Add atleast one service");
        //     return;
        // }
        setIsSubmitLoading(true);
        let formdata = { ...businessList, ...data }
        const payload: BusinessListing = {
            ...formdata,
            contact: contact,
            website: !!formdata.website ? "https://" + formdata.website : "",
            bus_hours: stringifyBusHours(businessList.bus_hours),
            step_number: (!source) ? ListingWorkflow.AddDetails : data.step_number,
            location: location
        }
        postBusinessListing(payload);
    }

    const postBusinessListing = async (payload: any) => {
        // console.log(payload)
        const endpoint = Products.business.api.base;
        if (type === "edit" || type === "edit_back") {
            const response = await putRequestApi(endpoint, payload, source);
            // console.log(response);
            if (response.data) {
                toast.success("Business profile saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/business-listing/upload-images?type=new&source=${response.data.id}`);
                else {
                    toast.info("Redirecting to listing menu...")
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    router.push(`/dashboard/business-listing/view-all`)
                }
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
        else {
            const response = await postRequestApi(endpoint, payload);
            // console.log(response);
            if (response.data) {
                toast.success("Business profile saved successfully!");
                router.push(`/dashboard/business-listing/upload-images?type=${type}&source=${response.data.id}`);
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
    }
    useEffect(() => {
        setBusinessList({ ...businessList, bus_hours: businessHours })
    }, [businessHours])

    const inputServiceRef: any = useRef(null);
    const handleDivClick = () => {
        if (inputServiceRef.current) {
            inputServiceRef.current.focus();
        }
    };
    const onKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const submitForm = () => {
        !!formRef.current && formRef.current.requestSubmit();
    }

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg p-2 *:py-2 *:px-5 *:block font-semibold'>
            <Button className='btn-primary text-base' color='primary' type='submit' isLoading={isSubmitLoading}
                onPress={() => submitForm()}>
                {!isSubmitLoading && ((type === "edit") ? "Save" : "Save and Continue")}
            </Button>
        </div>
    );
    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Uploading your Business..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Business Details" : "Add New Business"}</div>
                </div>
                <form ref={formRef} onKeyPress={onKeyPress} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-8 gap-8">
                                <Autocomplete
                                    variant="flat"
                                    defaultItems={subCategoryList}
                                    label="Select your Business Type"
                                    onSelectionChange={onSubCategoryChange}
                                    selectedKey={businessList.sub_category}
                                    isDisabled={!!source || disabled}
                                    classNames={{ listboxWrapper: "nextui-listbox" }}
                                    isRequired
                                >
                                    {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                </Autocomplete>
                                <Input isDisabled={true}
                                    value={categoryName}
                                    type="text"
                                    variant="flat"
                                    label="Listing Category" />
                            </div>
                        </div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='name'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("name")}
                                        value={value}
                                        type="text"
                                        variant="flat"
                                        label="Business Name"
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
                                        value={value}
                                        variant="flat"
                                        label="Description" />
                                )}
                            />
                        </div>
                        <div className='mb-6'>
                            <Controller
                                control={control}
                                name='website'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled} {...register("website")} value={value?.replace("https://", "")}
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">https://</span>
                                            </div>
                                        }
                                        type="text"
                                        variant="flat"
                                        placeholder='yourdomain.com'
                                        label="Business Website (optional)" />
                                )}
                            />
                        </div>
                    </InView>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='location' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Location</div>
                        <div className="mb-8">
                            <Autocomplete
                                variant="flat"
                                defaultItems={areaList || []}
                                label="Select your Area"
                                onSelectionChange={onAreaChange}
                                isDisabled={disabled}
                                selectedKey={businessList.area}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
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
                                        value={value}
                                        variant="flat"
                                        label="Full Address"
                                        isRequired />
                                )}
                            />
                        </div>
                        <div className='mb-6'>
                            <AddLocationMap setLocation={handleLocation} location={location} isExistingLoc={isExistingLoc} />
                            {/* <p>Selected Location: {location.coordinates.lat}, {location.coordinates.lng}</p> */}
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Business Contact Details</div>
                        <ContactForm txtContactDisabled={disabled} defaultContact={contact} contactDetails={handleContactDetails} />
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='services' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Services</div>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='flex gap-4 mb-6'>
                                <div onClick={handleDivClick} className='relative w-full inline-flex shadow-sm px-3 bg-default-100 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium flex-col items-start justify-center gap-0 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background py-2 is-filled'>
                                    <div className='flex flex-wrap gap-3 w-full'>
                                        {businessList.services.map((service, i) =>
                                            <div className='default-pill-btn flex gap-2 items-center' key={i}>{service}
                                                <button>
                                                    <X className='bg-default-100 p-1 rounded-full'
                                                        strokeWidth={3} color='#636363' size={20} onClick={(e) => onRemoveServices(e, service)} />
                                                </button>
                                            </div>
                                        )}
                                        <input ref={inputServiceRef} placeholder="Haicut, Spa, Manicure, Facial"
                                            className='w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 text-small group-data-[has-value=true]:text-default-foreground is-filled' disabled={disabled} onChange={(e) => handleServiceChange(e)} value={txtService} />
                                    </div>
                                </div>
                                <button disabled={disabled} className='btn-primary w-auto rounded-lg py-2 h-[44px]' type='button' onClick={() => onAddServices()}>Add</button>
                            </div>
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='timings' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Busines Hours</div>
                        <div className='mb-8 flex flex-col md:gap-x-4 gap-y-10 md:gap-y-8'>
                            {businessList.bus_hours.map((x: any, i: any) =>
                                <div className='grid grid-cols-12 gap-0 md:gap-1 content-center flex items-center' key={i}>
                                    <div className='col-span-4 md:col-span-2 mb-7 md:mb-0'>{x.day}</div>
                                    <Switch className='col-span-6 md:col-span-3 mb-7 md:mb-0'
                                        isDisabled={disabled}
                                        size='md'
                                        name={x.day}
                                        onChange={(e) => handleBusDaysChange(e)}
                                        isSelected={x.isOpen}>
                                        {x.isOpen ? "Open" : "Closed"}
                                    </Switch>
                                    <Select
                                        items={TimeList}
                                        label="Opening Time"
                                        variant="flat"
                                        selectedKeys={x.open_time}
                                        className="col-span-5 md:col-span-3 w-full"
                                        onSelectionChange={(e: any) => handleBusOpenHrsChange(e, x.day)}
                                        name={x.day}
                                        isDisabled={!x.isOpen}
                                    >
                                        {(time) => (
                                            <SelectItem key={time.key}>
                                                {time.label}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <div className='col-span-2 md:col-span-1 justify-self-center'>TO</div>
                                    <Select
                                        items={TimeList}
                                        label="Closing Time"
                                        variant="flat"
                                        selectedKeys={x.close_time}
                                        className="col-span-5 md:col-span-3 w-full"
                                        onSelectionChange={(e: any) => handleBusCloseHrsChange(e, x.day)}
                                        name={x.day}
                                        isDisabled={!x.isOpen}
                                    >
                                        {(time) => (
                                            <SelectItem key={time.key}>
                                                {time.label}
                                            </SelectItem>
                                        )}
                                    </Select>
                                </div>
                            )}
                        </div>
                    </InView>
                </form>
            </div>
            <div className='hidden lg:block col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>
                    <a className={`${activeEl === 'general' && 'active'}`} href='#general'>General</a>
                    <a className={`${activeEl === 'location' && 'active'}`} href='#location'>Location</a>
                    <a className={`${activeEl === 'contact' && 'active'}`} href='#contact'>Contact</a>
                    <a className={`${activeEl === 'services' && 'active'}`} href='#services'>Services</a>
                    <a className={`${activeEl === 'timings' && 'active'}`} href='#timings'>Timings</a>
                </div>
            </div>
        </>
    )
}

export default Page