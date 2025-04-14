"use client"
import { Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from "@heroui/react"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactForm from '@/app/components/forms/contact-form';
import { ClassifiedListing, ContactComponent } from '@/lib/typings/dto';
import { useAtomValue } from 'jotai';
import { areas, classifiedCategories } from '@/lib/atom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { Products, SelectList } from '@/public/shared/app.config';
import FormLoading from '@/app/loading-components/form-loading';
import { toast } from 'react-toastify';
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
    const categoryList = useAtomValue<any>(classifiedCategories).data;
    const areaList = useAtomValue<any>(areas).data;
    const [contact, setContact] = useState<ContactComponent>({
        contact_name: userData.name,
        contact_number: userData.phone,
        contact_email_id: userData.email
    });
    const [classifiedDetails, setClassifiedDetails] = useState<any>(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [classifiedList, setClassifiedList] = useState<ClassifiedListing>({
        name: "",
        area: "",
        sale_amount: 0,
        description: "",
        contact: contact,
        slug: "",
        tags: "",
        category: "",
        ownership_history: "",
        year_of_purchase: "",
        step_number: ListingWorkflow.Initial,
        details_by_category: classifiedDetails
    });
    const [apiRes, setApiRes] = useState<any>();
    const [subCategory, setSubCategory] = useState<any>("");
    const updateComponents = (id: any, component: any) => {
        const sub_category = categoryList.find((x: any) => x.id === (Number(id)))?.sub_category;
        setClassifiedList({ ...classifiedList, category: id });
        setSubCategory(sub_category);
        !!component ? setClassifiedDetails(component?.find((x: any) => sub_category === x.__component)) :
            setClassifiedDetails((prev: any) => ({
                ...prev,
                __component: sub_category
            }));
    }
    const onCategoryChange = (id: any) => updateComponents(id, null);
    const onAreaChange = (id: any) => setClassifiedList({ ...classifiedList, area: id });

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);

    useEffect(() => {
        if (apiRes) {
            updateComponents(apiRes?.category.id, apiRes.details_by_category);
            setContact(apiRes.contact);
            setClassifiedList(prev => ({
                ...prev,
                ...apiRes,
                category: apiRes.category.id.toString(),
                area: apiRes.area.id.toString(),
                contact: apiRes.contact
            }));
        }
    }, [apiRes, categoryList])

    const populateClassifiedDetails = useCallback(async () => {
        if (source) {
            const attr = Products.classifieds.api;
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
        defaultValues: async () => populateClassifiedDetails()
    });

    const handleContactDetails = (data: any) => setContact(data);

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        let formdata = { ...classifiedList, ...data }
        const payload: ClassifiedListing = {
            ...formdata,
            contact: contact,
            step_number: (!source) ? ListingWorkflow.AddDetails : data.step_number,
            details_by_category: !!classifiedDetails && !!classifiedDetails.__component ? [classifiedDetails] : []
        }
        postClassifiedListing(payload);
    }

    const postClassifiedListing = async (payload: any) => {
        console.log(payload)
        const endpoint = Products.classifieds.api.base;
        if (type === "edit" || type === "edit_back") {
            const response = await putRequestApi(endpoint, payload, source);
            console.log(response);
            if (response.data) {
                toast.success("Classified details saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/classified-listing/upload-images?type=new&source=${response.data.id}`);
                else {
                    toast.info("Redirecting to listing menu...")
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    router.push(`/dashboard/classified-listing/view-all`)
                }
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
        else {
            const response = await postRequestApi(endpoint, payload);
            console.log(response);
            if (response.data) {
                toast.success("Classified details saved successfully!");
                router.push(`/dashboard/classified-listing/upload-images?type=${type}&source=${response.data.id}`);
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
    }

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

    // useEffect(() => {
    //     console.log(classifiedList)
    // }, [classifiedList])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Uploading your Classified..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Classified Details" : "Add New Classified"}</div>
                </div>
                <form ref={formRef} onKeyPress={onKeyPress} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className="mb-8">
                            <Autocomplete
                                variant="flat"
                                defaultItems={categoryList || []}
                                label="Select a Product Category"
                                onSelectionChange={onCategoryChange}
                                selectedKey={classifiedList.category}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                            >
                                {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
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
                                        label="Product Name"
                                        isRequired />
                                )}
                            />
                        </div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='sale_amount'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("sale_amount")}
                                        value={value}
                                        type="number"
                                        variant="flat"
                                        label="Amount for Sale"
                                        startContent={
                                            <div className="pointer-events-none flex items-center">
                                                <span className="text-default-400 text-small">₹</span>
                                            </div>
                                        }
                                        isRequired />

                                )}
                            />
                        </div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Select label="Ownership History" selectedKeys={[classifiedList?.ownership_history?.toString()]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setClassifiedList((prev: any) => ({
                                        ...prev,
                                        ownership_history: e.target.value,
                                    }))
                                }>
                                {SelectList.Ordinals.map((item) => (
                                    <SelectItem key={item.number}>
                                        {item.label + " Owner"}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Year of Purchase" selectedKeys={[classifiedList?.year_of_purchase]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setClassifiedList((prev: any) => ({
                                        ...prev,
                                        year_of_purchase: e.target.value,
                                    }))
                                }>
                                {SelectList.YearList.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='description'
                                render={({ field: { value } }) => (
                                    <Textarea isDisabled={disabled}
                                        {...register("description")}
                                        value={value}
                                        variant="flat"
                                        label="Product Description" />
                                )}
                            />
                        </div>
                    </InView>
                    {subCategory === "classified.vehicle-details" && <InView threshold={1} as="div" onChange={onViewScroll} id='location' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Vehicle Details</div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={classifiedDetails?.model_name?.toString() || ""}
                                onChange={(e: any) =>
                                    setClassifiedDetails((prev: any) => ({
                                        ...prev,
                                        model_name: e.target.value,
                                    }))
                                }
                                type="text"
                                variant="flat"
                                label="Vehicle Model"
                                isRequired />
                            <Select label="Fuel Type" selectedKeys={[classifiedDetails?.fuel_type]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setClassifiedDetails((prev: any) => ({
                                        ...prev,
                                        fuel_type: e.target.value,
                                    }))
                                }>
                                {SelectList.FuelType.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Transmission" selectedKeys={[(classifiedDetails?.transmission)?.toString()]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setClassifiedDetails((prev: any) => ({
                                        ...prev,
                                        transmission: e.target.value,
                                    }))
                                }>
                                {SelectList.VehicleTransmission.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Select label="Year of Manufacture" selectedKeys={[classifiedDetails?.year_of_manufacture]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setClassifiedDetails((prev: any) => ({
                                        ...prev,
                                        year_of_manufacture: e.target.value,
                                    }))
                                }>
                                {SelectList.YearList.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Input isDisabled={disabled}
                                value={classifiedDetails?.kms_driven?.toString() || ""}
                                onChange={(e: any) =>
                                    setClassifiedDetails((prev: any) => ({
                                        ...prev,
                                        kms_driven: e.target.value,
                                    }))
                                }
                                type="number"
                                variant="flat"
                                label="Kms Driven"
                                isRequired />
                        </div>
                    </InView>}
                    <InView threshold={1} as="div" onChange={onViewScroll} id='location' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Location</div>
                        <div className="mb-8">
                            <Autocomplete
                                variant="flat"
                                defaultItems={areaList || []}
                                label="Select your Area"
                                onSelectionChange={onAreaChange}
                                isDisabled={disabled}
                                selectedKey={classifiedList.area}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                            >
                                {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Contact Details</div>
                        <ContactForm txtContactDisabled={disabled} defaultContact={contact} contactDetails={handleContactDetails} />
                    </InView>
                </form>
            </div>
            <div className='hidden lg:block col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>
                    <a className={`${activeEl === 'general' && 'active'}`} href='#general'>General</a>
                    <a className={`${activeEl === 'location' && 'active'}`} href='#location'>Location</a>
                    <a className={`${activeEl === 'contact' && 'active'}`} href='#contact'>Contact</a>
                </div>
            </div>
        </>
    )
}

export default Page