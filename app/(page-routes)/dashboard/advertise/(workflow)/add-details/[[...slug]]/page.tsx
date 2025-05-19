"use client"
import { Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from "@heroui/react"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactForm from '@/app/components/forms/contact-form';
import { AdListing, ContactComponent } from '@/lib/typings/dto';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { Products } from '@/public/shared/app.config';
import FormLoading from '@/app/loading-components/form-loading';
import { toast } from 'react-toastify';
import { ActivityLog, ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';
import { CreateActivityLogPayload, FormatNameField } from "@/lib/helpers";

const Page = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const bizlink = searchParams.get('bizlink');
    const formRef = useRef<HTMLFormElement>(null);
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [disabled, setDisabled] = useState(true);
    const [contact, setContact] = useState<ContactComponent>({
        contact_name: userData.name,
        contact_number: userData.phone,
        contact_email_id: userData.email
    });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [adList, setAdList] = useState<AdListing>({
        name: "",
        contact: contact,
        user: userData.strapiUserId,
        website: "",
        ad_image: {},
        step_number: ListingWorkflow.Initial,
        activity_log: [{
            event: "",
            processed: ""
        }]
    });
    const [apiRes, setApiRes] = useState<any>();

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);

    useEffect(() => {
        if (apiRes) {
            setContact(apiRes.contact);
            setAdList(prevAdList => ({
                ...prevAdList,
                contact: apiRes.contact,
            }));
        }
    }, [apiRes])

    const populateAdDetails = useCallback(async () => {
        if (source) {
            const attr = Products.advertisement.api;
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
        defaultValues: async () => populateAdDetails()
    });

    const handleContactDetails = (data: any) => setContact(data);
    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        data.name = data.name.trim();
        let formdata = { ...adList, ...data }
        const payload: AdListing = {
            ...formdata,
            contact: contact,
            user: userData.strapiUserId,
            website: !!formdata.website ? (!formdata.website.includes("https://") ? "https://" + formdata.website : formdata.websit) : "",
            business_listing: bizlink || null,
            step_number: (!source || !apiRes.ad_image) ? ListingWorkflow.AddDetails : data.step_number
        }
        postAdListing(payload);
    }

    const postAdListing = async (payload: any) => {
        // console.log(payload)
        const endpoint = Products.advertisement.api.base;
        if (type === "edit" || type === "edit_back") {
            payload.activity_log = CreateActivityLogPayload(ActivityLog.ListingUpdated);
            const response = await putRequestApi(endpoint, payload, source);
            // console.log(response);
            if (response.data) {
                toast.success("Ad profile saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/advertise/upload-images?type=new&source=${response.data.id}`);
                else {
                    toast.info("Redirecting to listing menu...")
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    router.push(`/dashboard/advertise/view-all`)
                }
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
        else {
            payload.activity_log = CreateActivityLogPayload(ActivityLog.ListingCreated);
            const response = await postRequestApi(endpoint, payload);
            // console.log(response);
            if (response.data) {
                toast.success("Ad profile saved successfully!");
                router.push(`/dashboard/advertise/upload-images?type=${type}&source=${response.data.id}`);
            }
            else {
                toast.error("An error occurred. Please contact the support.");
                setIsSubmitLoading(false);
            }
        }
    }
    // useEffect(() => {
    //     setAdList({ ...adList })
    // }, [])

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
            <Button className='btn-primary text-base' color='primary' type='submit' isLoading={isSubmitLoading} isDisabled={disabled}
                onPress={() => submitForm()}>
                {!isSubmitLoading && ((type === "edit") ? "Save" : "Save and Continue")}
            </Button>
        </div>
    );
    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading, disabled])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Uploading your Advertisement..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Advertisement Details" : "Add New Advertisement"}</div>
                </div>
                <form ref={formRef} onKeyPress={onKeyPress} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='name'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("name")}
                                        value={FormatNameField(value) || ""}
                                        type="text"
                                        variant="flat"
                                        label="Business Name"
                                        isRequired={true} />
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
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Ad Contact Details</div>
                        <ContactForm txtContactDisabled={disabled} defaultContact={contact} contactDetails={handleContactDetails} />
                    </InView>
                </form>
            </div>
        </>
    )
}

export default Page