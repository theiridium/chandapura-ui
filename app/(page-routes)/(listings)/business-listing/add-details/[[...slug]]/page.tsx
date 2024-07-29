"use client"
import { Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from '@nextui-org/react'
import React, { useCallback, useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactListForm from '@/app/components/forms/contact-list-form';
import { BusinessListing } from '@/lib/typings/dto';
import { useAtomValue } from 'jotai';
import { categories, locations } from '@/lib/atom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi } from '@/lib/interceptor';
import { Products } from '@/public/shared/app.config';
import timeList from "@/lib/data/time-list.json";
import { X } from 'lucide-react';
import FormSubmitLoading from '@/app/loading-components/form-submit-loading';

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [disabled, setDisabled] = useState(true);
    const categoryList = useAtomValue<any>(categories).data;
    const locationList = useAtomValue<any>(locations).data;
    const { data }: any = useSession();
    const userData = data?.user;
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [contact, setContact] = useState();
    const [isSumbitLoading, setIsSubmitLoading] = useState(false);
    const [businessHours, setBusinessHours] = useState([
        {
            day: "Monday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Tuesday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Wednesday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Thursday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Friday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Saturday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
        {
            day: "Sunday",
            open_time: new Set(["09:00 AM"]),
            close_time: new Set(["09:00 PM"]),
            isOpen: false
        },
    ]);
    const [businessList, setBusinessList] = useState<BusinessListing>({
        area: "",
        name: "",
        full_address: "",
        description: "",
        bus_contact: 0,
        user: userData,
        slug: "",
        tags: "",
        sub_category: "",
        gallery_images: [],
        category: "",
        website: "",
        services: [],
        bus_hours: businessHours,
        featured_image: {}
    });
    const [apiRes, setApiRes] = useState<any>();
    const onCategoryChange = (id: any) => {
        setBusinessList({ ...businessList, category: id });
        let subCat = id ? categoryList.filter((x: any) => x.id == id)[0].sub_categories : [];
        setSubCategoryList(subCat);
    }

    const onSubCategoryChange = (id: any) => setBusinessList({ ...businessList, sub_category: id });
    const onAreaChange = (id: any) => setBusinessList({ ...businessList, area: id });

    //Service
    const [txtService, setTxtService] = useState("");
    const handleServiceChange = (e: any) => setTxtService(e.target.value);
    const onAddServices = () => {
        if (txtService) {
            const list = [...businessList.services, txtService];
            setBusinessList({ ...businessList, services: list })
            setTxtService("");
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
            onCategoryChange(apiRes?.category.id);
            setBusinessList(prevBusinessList => ({
                ...prevBusinessList,
                category: apiRes.category.id.toString(),
                sub_category: apiRes.sub_category.id.toString(),
                area: locationList.filter((x: any) => x.name == apiRes.area)[0].id.toString(),
                bus_contact: apiRes.bus_contact.id,
                services: apiRes.services,
                bus_hours: businessHours
            }));
        }
    }, [apiRes, businessHours, categoryList, subCategoryList])

    const populateBusinessDetails = useCallback(async () => {
        if (source) {
            const attr = Products.business.api;
            let apiUrl = `${attr.base}?${attr.filter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
            const response = await getPublicApiResponse(apiUrl).then(res => res.data);
            const data = response[0];
            if (data) {
                setApiRes(data);
                setBusinessHours(data.bus_hours);
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

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        let formdata = { ...data, businessList }
        const payload: BusinessListing = {
            area: locationList.filter((x: any) => x.id == parseInt(businessList.area))[0].name,
            name: formdata.name,
            full_address: formdata.full_address,
            description: formdata.description,
            bus_contact: contact,
            user: userData,
            slug: formdata.slug,
            tags: formdata.tags,
            sub_category: businessList.sub_category,
            gallery_images: [],
            category: businessList.category,
            website: formdata.website,
            services: businessList.services,
            bus_hours: stringifyBusHours(businessList.bus_hours),
            featured_image: {}
        }
        // console.log(payload)
        // postBusinessListing(payload);
    }

    const postBusinessListing = async (payload: any) => {
        // console.log(payload)
        const endpoint = Products.business.api.base;
        const response = await postRequestApi(endpoint, payload);
        console.log(response);
        if (response.data) {
            setIsSubmitLoading(false);
            router.push(`/business-listing/upload-images?type=new&source=${response.data.id}`);
        }
        // router.push(`/business-listing/upload-images/4`);
    }

    useEffect(() => {
        setBusinessList({...businessList, bus_hours: businessHours})
    }, [businessHours])


    return (
        <>
            {isSumbitLoading && <FormSubmitLoading text={"Uploading your Business..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Business Details" : "Add New Business"}</div>
                </div>
                <form className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-8 gap-8">
                                <Autocomplete
                                    variant="flat"
                                    defaultItems={categoryList || []}
                                    label="Select a Category"
                                    onSelectionChange={onCategoryChange}
                                    selectedKey={businessList.category}
                                    isDisabled={!!source || disabled}
                                    isRequired={true}
                                >
                                    {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                </Autocomplete>
                                <Autocomplete
                                    variant="flat"
                                    defaultItems={subCategoryList}
                                    label="Select a Sub-Category"
                                    onSelectionChange={onSubCategoryChange}
                                    selectedKey={businessList.sub_category}
                                    isDisabled={!!source || disabled}
                                    isRequired={true}
                                >
                                    {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                                </Autocomplete>
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
                                        isRequired={true} />
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
                                    <Input isDisabled={disabled} {...register("website")} value={value} type="text" variant="flat" label="Business Website (optional)" />
                                )}
                            />
                        </div>
                    </InView>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='location' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Location</div>
                        <div className="mb-8">
                            <Autocomplete
                                variant="flat"
                                defaultItems={locationList || []}
                                label="Select an Area"
                                onSelectionChange={onAreaChange}
                                isDisabled={disabled}
                                selectedKey={businessList.area}
                                isRequired={true}
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
                                        isRequired={true} />
                                )}
                            />
                        </div>
                        <div className='mb-6'>
                            <Input isDisabled={disabled} type="text" variant="flat" label="Set Location on Map" />
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Business Contact Details</div>
                        <ContactListForm user={userData} contactId={setContact} selectedKey={businessList.bus_contact} />
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='services' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Services</div>
                        <div className='w-full flex flex-col gap-4'>
                            <div className='flex gap-4 mb-6'>
                                <Input isDisabled={disabled} className='' type="text" variant="flat" label="Add a Service" onChange={(e) => handleServiceChange(e)} value={txtService} />
                                <button disabled={disabled} className='btn-primary w-auto rounded-lg py-2' type='button' onClick={() => onAddServices()}>Add</button>
                            </div>
                            <div className='flex flex-wrap gap-4'>
                                {businessList.services.map((service, i) =>
                                    <div className='yellow-pill flex gap-2 items-center' key={i}>{service}
                                        <button>
                                            <X className='bg-red-700/40 hover:bg-red-700/60 p-1 rounded-full'
                                                strokeWidth={3} color='#450a0a' size={20} onClick={(e) => onRemoveServices(e, service)} />
                                        </button>
                                    </div>
                                )}
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
                                        items={timeList}
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
                                        items={timeList}
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
                    <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                        {/* <button className='btn-primary text-base' type='submit'>Save and Continue</button> */}
                        <Button className='btn-primary text-base' color='primary' type='submit' isLoading={isSumbitLoading}>{!isSumbitLoading && "Save and Continue"}</Button>
                    </div>
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