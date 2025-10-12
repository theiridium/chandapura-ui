"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react';
import { ContactComponent, PropertyListing } from '@/lib/typings/dto';
import { useAtomValue, useSetAtom } from 'jotai';
import { REAmenities, PGAmenities, PlotAmenities, listingFormBtnEl } from '@/lib/atom';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { CloudImages, Products, Resource, SelectList } from '@/public/shared/app.config';
import { toast } from 'react-toastify';
import { ActivityLog, ListingWorkflow } from '@/lib/typings/enums';
import { CreateActivityLogPayload } from "@/lib/helpers";

import Location from '../location'
import ListingType from "../listing-type";
import PropertyDetails from "../property-details";
import Pricing from "../pricing";
import ContactDetails from "../contact-details";

const Page = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    let type = searchParams.get('type');
    let form = searchParams.get('form');
    let source = searchParams.get('source');
    useEffect(() => {
        if (!type) {
            type = "new";
            if (!form) form = "listing-type";
            const sourceParam = !!source ? `&source=${source}` : "";
            router.push(`${pathname}?type=${type}&form=${form}${sourceParam}`)
        }
    }, [])

    const formRef = useRef<HTMLFormElement>(null);
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);

    const [disabled, setDisabled] = useState(true);
    const propertyTypeList = SelectList.PropertyType;
    const [propertyTypeDisabledKeys, setPropertyTypeDisabledKeys] = useState<any>([]);
    const realEstateAmenityList = useAtomValue<any>(REAmenities).data;
    const pgAmenityList = useAtomValue<any>(PGAmenities).data;
    const plotAmenityList = useAtomValue<any>(PlotAmenities).data;

    const [amenityList, setAmenityList] = useState<any>([]);
    const [propertyDetails, setPropertyDetails] = useState<any>(null);
    const [amenitiesValues, setAmenitiesValues] = useState<Set<string>>(new Set());
    const [contact, setContact] = useState<ContactComponent>({
        contact_name: userData?.name,
        contact_number: userData?.phone,
        contact_email_id: userData?.email
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
        details_by_listingtype: propertyDetails,
        activity_log: [{
            event: "",
            processed: ""
        }]
    });
    const [apiRes, setApiRes] = useState<any>();

    const steps = [
        { key: "ListingType", formUrl: "listing-type" },
        { key: "Location", formUrl: "location" },
        { key: "PropertyDetails", formUrl: "property-details" },
        { key: "Pricing", formUrl: "pricing" },
        { key: "ContactDetails", formUrl: "contact-details" },
    ];
    const [currentBlock, setCurrentBlock] = useState<string>("ListingType");
    const currentStepIndex = steps.findIndex(s => s.key === currentBlock);

    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentBlock(steps[currentStepIndex + 1].key);
            const sourceParam = !!source ? `&source=${source}` : "";
            router.push(`${pathname}?type=${type}&form=${steps[currentStepIndex + 1].formUrl}${sourceParam}`)
        }
    }

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentBlock(steps[currentStepIndex - 1].key);
            const sourceParam = !!source ? `&source=${source}` : "";
            router.push(`${pathname}?type=${type}&form=${steps[currentStepIndex - 1].formUrl}${sourceParam}`)
        }
    }

    // Fetch data if editing
    const populatePropertyDetails = useCallback(async () => {
        if (source) {
            const attr = Products.realEstate.api;
            const apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=${attr.populateList}`;
            const response = await getPublicApiResponse(apiUrl).then(res => res.data);
            const data = response[0];
            if (data) {
                setApiRes(data);
                setDisabled(false);
                return data;
            } else window.location.replace('/');
        } else setDisabled(false)
    }, [source]);

    useEffect(() => {
        if (apiRes) {
            const property_details = getPropertyDetailsComp(apiRes);
            setContact(apiRes.contact);
            setLocation(apiRes.location);
            setIsExistingLoc(true);
            setPropertyDetails(property_details);
            setAmenitiesValues(new Set(property_details.amenities.map((item: any) => String(item.id))));
            setPropertyListing({
                ...apiRes,
                area: apiRes.area.id?.toString(),
                contact: apiRes.contact,
                location: apiRes.location,
                details_by_listingtype: property_details
            });
        }
    }, [apiRes]);

    const getPropertyDetailsComp = (data: any) => {
        if (data.property_type === "PG") return data.details_by_listingtype.find((x: any) => x.__component === Products.pg.api.component);
        if (data.property_type === "Plot") return data.details_by_listingtype.find((x: any) => x.__component === Products.plot.api.component);
        if (data.listing_type === "Rent") return data.details_by_listingtype.find((x: any) => x.__component === Products.rent.api.component);
        if (data.listing_type === "Sale") return data.details_by_listingtype.find((x: any) => x.__component === Products.sale.api.component);
        return null;
    }

    const { register, handleSubmit, watch, control } = useForm<any>({ defaultValues: async () => populatePropertyDetails() });

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        const payload: PropertyListing = {
            ...propertyListing,
            ...data,
            contact,
            step_number: (!source) ? ListingWorkflow.AddDetails : data.step_number,
            location,
            details_by_listingtype: [propertyDetails]
        }
        postPropertyListing(payload);
    }

    const postPropertyListing = async (payload: any) => {
        const endpoint = Products.realEstate.api.base;
        if (type === "edit" || type === "edit_back") {
            payload.activity_log = CreateActivityLogPayload(ActivityLog.ListingUpdated);
            const response = await putRequestApi(endpoint, payload, source);
            if (response.data) {
                toast.success("Property details saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/property-listing/upload-images?type=new&source=${response.data.id}`);
                else setTimeout(() => router.push(`/dashboard/property-listing/view-all`), 3000);
            } else toast.error("An error occurred. Please contact the support.");
        } else {
            payload.activity_log = CreateActivityLogPayload(ActivityLog.ListingCreated);
            const response = await postRequestApi(endpoint, payload);
            if (response.data) router.push(`/dashboard/property-listing/upload-images?type=${type}&source=${response.data.id}`);
            else toast.error("Some unexpected error has occured, Please contact support.");
        }
    }

    const submitForm = () => !!formRef.current && formRef.current.requestSubmit();

    // Sync amenities
    useEffect(() => {
        if (propertyListing.listing_type === "PG") {
            setAmenityList(pgAmenityList);
            setPropertyListing((prev: any) => ({ ...prev, property_type: "PG" }));
            setPropertyDetails((prev: any) => ({ ...prev, __component: Products.pg.api.component }));
        } else if (propertyListing.listing_type === "Rent") {
            setAmenityList(realEstateAmenityList);
            setPropertyDetails((prev: any) => ({ ...prev, __component: Products.rent.api.component }));
        } else if (propertyListing.listing_type === "Sale") {
            if (propertyListing.property_type !== "Plot") {
                setAmenityList(realEstateAmenityList);
                setPropertyDetails((prev: any) => ({ ...prev, __component: Products.sale.api.component }));
            } else {
                setAmenityList(plotAmenityList);
                setPropertyDetails((prev: any) => ({ ...prev, __component: Products.plot.api.component }));
            }
        } else setAmenityList(realEstateAmenityList);
    }, [propertyListing.listing_type, propertyListing.property_type]);

    useEffect(() => {
        if (amenityList && amenitiesValues?.size > 0) {
            setPropertyDetails((prev: any) => ({
                ...prev,
                amenities: amenityList.filter((item: any) => amenitiesValues.has(String(item.id)))
            }));
        }
    }, [amenitiesValues, amenityList]);

    useEffect(() => {
        setPropertyDetails((prev: any) => ({ ...prev, amenities: [] }));
    }, [propertyListing.listing_type]);

    useEffect(() => {
        setPropertyTypeDisabledKeys(
            propertyListing.listing_type === "Rent" ? ["Plot", "PG"] :
                propertyListing.listing_type === "Sale" ? ["PG"] : []
        );
        if (source === "new") setPropertyListing(prev => ({ ...prev, property_type: "", room_type: "" }));
    }, [propertyListing.listing_type]);

    useEffect(() => setListingFormBtnEl(null), [isSubmitLoading]);

    return (
        <>
            <div className='col-span-full lg:col-span-6 mt-3 mb-10 lg:my-10'>
                <form ref={formRef} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    {currentBlock === "ListingType" &&
                        <ListingType
                            propertyListing={propertyListing}
                            setPropertyListing={setPropertyListing}
                            disabled={disabled}
                            setAmenitiesValues={setAmenitiesValues}
                            source={source}
                            propertyTypeDisabledKeys={propertyTypeDisabledKeys}
                            propertyTypeList={propertyTypeList}
                            nextStep={nextStep}
                        />
                    }
                    {currentBlock === "Location" &&
                        <Location
                            propertyListing={propertyListing}
                            setPropertyListing={setPropertyListing}
                            disabled={disabled}
                            control={control}
                            register={register}
                            watch={watch}
                            isExistingLoc={isExistingLoc}
                            location={location}
                            setLocation={setLocation}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    }
                    {currentBlock === "PropertyDetails" &&
                        <PropertyDetails
                            propertyListing={propertyListing}
                            setPropertyListing={setPropertyListing}
                            disabled={disabled}
                            control={control}
                            register={register}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            propertyTypeList={propertyTypeList}
                            amenityList={amenityList}
                            amenitiesValues={amenitiesValues}
                            setAmenitiesValues={setAmenitiesValues}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    }
                    {currentBlock === "Pricing" &&
                        <Pricing
                            propertyListing={propertyListing}
                            disabled={disabled}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    }
                    {currentBlock === "ContactDetails" &&
                        <ContactDetails
                            propertyListing={propertyListing}
                            disabled={disabled}
                            propertyDetails={propertyDetails}
                            setPropertyDetails={setPropertyDetails}
                            contact={contact}
                            setContact={setContact}
                            isSubmitLoading={isSubmitLoading}
                            submitForm={submitForm}
                            type={type}
                            prevStep={prevStep}
                        />
                    }
                </form>
            </div>
            <div className='hidden lg:block col-span-full lg:col-span-2 mt-3 mb-10 lg:my-10'>
                <img className='w-full rounded-xl' src={CloudImages.SideBannerBusiness} />
            </div>
        </>
    )
}

export default Page;
