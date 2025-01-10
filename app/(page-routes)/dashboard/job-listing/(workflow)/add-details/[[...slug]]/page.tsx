"use client"
import { Autocomplete, AutocompleteItem, Button, Chip, cn, Input, Radio, RadioGroup, Select, SelectedItems, SelectItem, Switch, Textarea, TimeInput, useDisclosure } from '@nextui-org/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import ContactForm from '@/app/components/forms/contact-form';
import { ContactComponent, JobListing } from '@/lib/typings/dto';
import { useAtomValue } from 'jotai';
import { areas, languages } from '@/lib/atom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { getPublicApiResponse, postRequestApi, putRequestApi } from '@/lib/apiLibrary';
import { Products, SelectList } from '@/public/shared/app.config';
import FormLoading from '@/app/loading-components/form-loading';
import { toast } from 'react-toastify';
import { ListingWorkflow } from '@/lib/typings/enums';
import { RadioBox } from '@/app/sub-components/radio-box';
import TimeList from "@/lib/data/time-list.json";
import moment from 'moment';

const Page = () => {
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [disabled, setDisabled] = useState(true);
    const areaList = useAtomValue<any>(areas).data;
    const languageList = useAtomValue<any>(languages).data;
    const [languageValues, setLanguageValues] = useState<Selection | any>([]);
    const [contact, setContact] = useState<ContactComponent>({
        contact_name: userData.name,
        contact_number: userData.phone,
        contact_email_id: userData.email
    });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [jobListing, setJobListing] = useState<JobListing>({
        job_title: "",
        category: "Personal",
        gender: "",
        job_description: "",
        preferred_languages: languageValues,
        area: "",
        full_address: "",
        contact: contact,
        step_number: ListingWorkflow.Initial,
        details_by_jobCategory: jobDetails
    });
    const [apiRes, setApiRes] = useState<any>();
    const onAreaChange = (id: any) => setJobListing({ ...jobListing, area: id });

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);

    const getJobDetailsComp = (data: any) => {
        let job_details: any = null;
        switch (data.category) {
            case "Personal":
                job_details = data.details_by_jobCategory.find((x: any) => x.__component === Products.job.api.component_personalJob);
                break;

            case "Corporate":
                job_details = data.details_by_jobCategory.find((x: any) => x.__component === Products.job.api.component_corporateJob);
                break;

            default:
                break;
        }
        return job_details;
    }

    useEffect(() => {
        if (apiRes) {
            const job_details = getJobDetailsComp(apiRes);
            let jobDetailsFormatted = {
                ...job_details,
                job_timing_from: new Set([moment(job_details.job_timing_from, "HH:mm:ss").format("hh:mm A")]),
                job_timing_to: new Set([moment(job_details.job_timing_to, "HH:mm:ss").format("hh:mm A")])
            }
            setContact(apiRes.contact);
            setJobDetails(jobDetailsFormatted);
            setLanguageValues(new Set(apiRes.preferred_languages.map((item: any) => String(item.id))));
            setJobListing(prev => ({
                ...prev,
                ...apiRes,
                area: apiRes.area.id.toString(),
                contact: apiRes.contact
            }));
        }
    }, [apiRes])

    useEffect(() => {
        switch (jobListing.category) {
            case "Personal":
                // setAmenityList(pgAmenityList);
                setJobDetails((prev: any) => ({
                    ...prev,
                    __component: Products.job.api.component_personalJob
                }));
                break;

            case "Corporate":
                // setAmenityList(realEstateAmenityList);
                setJobDetails((prev: any) => ({
                    ...prev,
                    __component: Products.job.api.component_corporateJob
                }));
                break;
            default:
                break;
        }
    }, [jobListing.category])

    const populateJobDetails = useCallback(async () => {
        if (source) {
            const attr = Products.job.api;
            let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=${attr.populateList}`;
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
        defaultValues: async () => populateJobDetails()
    });

    const handleContactDetails = (data: any) => setContact(data);

    useEffect(() => {
        !!languageList && languageValues.length > 0 && setJobListing((prev: any) => ({
            ...prev,
            preferred_languages: languageList.filter((item: any) => languageValues.has(String(item.id)))
        }))
    }, [languageValues])

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        let formdata = { ...data, jobListing }
        let jobDetailsFormatted =
        {
            ...jobDetails,
            job_timing_from: moment(Array.from(jobDetails.job_timing_from)[0] as string, "hh:mm A").format("HH:mm:ss.SSS"),
            job_timing_to: moment(Array.from(jobDetails.job_timing_to)[0] as string, "hh:mm A").format("HH:mm:ss.SSS")
        }
        const payload: JobListing = {
            ...jobListing,
            job_title: formdata.job_title,
            job_description: formdata.job_description,
            full_address: formdata.full_address,
            contact: contact,
            step_number: ListingWorkflow.AddDetails,
            details_by_jobCategory: [jobDetailsFormatted]
        }
        postJobListing(payload);
    }

    const postJobListing = async (payload: any) => {
        console.log(payload)
        const endpoint = Products.job.api.base;
        if (type === "edit" || type === "edit_back") {
            const response = await putRequestApi(endpoint, payload, source);
            console.log(response);
            if (response.data) {
                toast.success("Job details saved successfully!");
                if (type === "edit_back") router.push(`/dashboard/job-listing/upload-images?type=new&source=${response.data.id}`);
                else {
                    toast.info("Redirecting to listing menu...")
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    router.push(`/dashboard/job-listing/view-all`)
                }
            }
        }
        else {
            const response = await postRequestApi(endpoint, payload);
            console.log(response);
            if (response.data) {
                toast.success("Job details saved successfully!");
                router.push(`/dashboard/job-listing/upload-images?type=${type}&source=${response.data.id}`);
            }
        }
    }

    const onKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // useEffect(() => {
    //     console.log(jobListing)
    // }, [jobListing])
    // useEffect(() => {
    //     console.log(jobDetails)
    // }, [jobDetails])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Uploading your Job..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>{source ? "Modify Job Details" : "Add New Job Vacancy"}</div>
                </div>
                <form onKeyPress={onKeyPress} className='grid grid-cols-1 gap-10 mx-2' onSubmit={handleSubmit(onSubmit)}>
                    <InView threshold={1} as="div" onChange={onViewScroll} id='general' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>General</div>
                        <div className='mb-8'>
                            <RadioGroup
                                value={jobListing?.category}
                                onChange={(e: any) => {
                                    // setAmenitiesValues(new Set([]))
                                    setJobListing({
                                        ...jobListing,
                                        category: e.target.value
                                    })
                                }}
                                size='sm'
                                orientation="horizontal"
                                label="Job posting for"
                                description="Job category cannot be changed once its published."
                                isDisabled={!!source || disabled}
                                isRequired>
                                <RadioBox value="Personal">
                                    Personal Service
                                </RadioBox>
                                <RadioBox value="Corporate">
                                    Corporate Job
                                </RadioBox>
                            </RadioGroup>
                        </div>

                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='job_title'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("job_title")}
                                        value={value}
                                        type="text"
                                        variant="flat"
                                        label="Job Title / Job Role"
                                        isRequired />
                                )}
                            />
                        </div>
                    </InView>
                    {jobListing?.category === "Personal" && <InView as="div" threshold={1} onChange={onViewScroll} id='jobDetails' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Job Details</div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='job_description'
                                render={({ field: { value } }) => (
                                    <Textarea isDisabled={disabled}
                                        {...register("job_description")}
                                        value={value}
                                        variant="flat"
                                        label="Job Description" />
                                )}
                            />
                        </div>
                        <div className={`relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5`}>Preferred Work Timings</div>
                        <div className='flex w-full mt-3 mb-8 flex-nowrap'>
                            <Select
                                items={TimeList}
                                label="From"
                                variant="bordered"
                                selectedKeys={jobDetails?.job_timing_from}
                                className="col-span-5 md:col-span-3 w-full"
                                classNames={{
                                    trigger: 'rounded-r-none'
                                }}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        job_timing_from: new Set([e.target.value]),
                                    }))
                                }
                                name={"job_timing_from"}
                                isDisabled={disabled}
                            >
                                {(time) => (
                                    <SelectItem key={time.key}>
                                        {time.label}
                                    </SelectItem>
                                )}
                            </Select>
                            <div className='bg-default-200 border-default-200 flex items-center px-5 min-10 h-14'>To</div>
                            <Select
                                items={TimeList}
                                label="To"
                                variant="bordered"
                                selectedKeys={jobDetails?.job_timing_to}
                                className="col-span-5 md:col-span-3 w-full"
                                classNames={{
                                    trigger: 'rounded-l-none'
                                }}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        job_timing_to: new Set([e.target.value]),
                                    }))
                                }
                                name={"job_timing_to"}
                                isDisabled={disabled}
                            >
                                {(time) => (
                                    <SelectItem key={time.key}>
                                        {time.label}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className={`relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5`}>Salary / month</div>
                        <div className='flex w-full mt-3 mb-8 flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={jobDetails?.salary_range_min?.toString() || ""}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        salary_range_min: e.target.value,
                                    }))
                                }
                                type="text"
                                classNames={{
                                    inputWrapper: 'rounded-r-none'
                                }}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">₹</span>
                                    </div>
                                }
                                variant="bordered"
                                label="Minimum Salary"
                                isRequired />
                            <div className='bg-default-200 border-default-200 flex items-center px-5 min-10 h-14'>To</div>
                            <Input isDisabled={disabled}
                                value={jobDetails?.salary_range_max?.toString() || ""}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        salary_range_max: e.target.value,
                                    }))
                                }
                                type="text"
                                classNames={{
                                    inputWrapper: 'rounded-l-none'
                                }}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">₹</span>
                                    </div>
                                }
                                variant="bordered"
                                label="Maximum Salary"
                                isRequired />
                        </div>
                        <div className='mb-8'>
                            <Select
                                items={languageList || []}
                                variant="flat"
                                label="Language Preference"
                                isMultiline={true}
                                selectionMode="multiple"
                                placeholder="Select language(s)"
                                classNames={{
                                    base: "w-full",
                                    trigger: "min-h-12 py-2",
                                    listboxWrapper: "nextui-listbox relative"
                                }}
                                selectedKeys={languageValues}
                                isDisabled={disabled}
                                onSelectionChange={setLanguageValues}
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
                                        <div className=''>
                                            {item.name}
                                            <span className='border border-slate-500 absolute right-1 w-5 h-5'></span>
                                        </div>
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className='mb-8'>
                            <Select label="Gender" selectedKeys={[jobListing?.gender]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
                                        ...prev,
                                        gender: e.target.value,
                                    }))
                                }>
                                {SelectList.Gender.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </InView>}



                    {jobListing?.category === "Corporate" && <InView as="div" threshold={1} onChange={onViewScroll} id='jobDetails' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Job Details</div>
                        <div className="mb-8">
                            <Input isDisabled={disabled}
                                value={jobDetails?.company_name?.toString() || ""}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        company_name: e.target.value,
                                    }))
                                }
                                type="text"
                                variant="flat"
                                label="Company Name"
                                isRequired />
                        </div>
                        <div className='mb-8'>
                            <Controller
                                control={control}
                                name='job_description'
                                render={({ field: { value } }) => (
                                    <Textarea isDisabled={disabled}
                                        {...register("job_description")}
                                        value={value}
                                        variant="flat"
                                        label="Job Description" />
                                )}
                            />
                        </div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Select label="Job Type" selectedKeys={[jobDetails?.job_type]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        job_type: e.target.value,
                                    }))
                                }>
                                {SelectList.JobType.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Number of Vacancies" selectedKeys={[(jobDetails.open_positions)?.toString()]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        open_positions: e.target.value,
                                    }))
                                }>
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <SelectItem key={i + 1}>
                                        {(i + 1).toString()}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Select label="Educational Qualification" selectedKeys={[jobDetails?.educational_qualification]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        educational_qualification: e.target.value,
                                    }))
                                }>
                                {SelectList.EducationalQualification.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className='mb-8'>
                            <RadioGroup
                                value={jobDetails?.job_experience}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        job_experience: e.target.value,
                                    }))
                                }
                                label="Job Experience"
                                size='sm'
                                orientation='horizontal'
                                isDisabled={disabled}
                                isRequired>
                                {SelectList.JobExperience.map((item: any, i) =>
                                    <RadioBox value={item} key={i}>
                                        {item}
                                    </RadioBox>
                                )}
                            </RadioGroup>
                        </div>
                        {jobDetails?.job_experience === "Experienced" && <div className='mb-8'>
                            <RadioGroup
                                value={jobDetails?.experience_in_years}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        experience_in_years: e.target.value,
                                    }))
                                }
                                label="Choose a minimum experience"
                                size='sm'
                                orientation="horizontal"
                                classNames={{ wrapper: 'gap-5' }}
                                isDisabled={disabled}
                                isRequired>
                                {SelectList.YearOfExperience.map((item: any, i: any) =>
                                    <Radio key={i} value={item}>{item}</Radio>)}
                            </RadioGroup>
                        </div>}
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap *:basis-full md:*:basis-1/2'>
                            <RadioGroup
                                value={jobDetails?.work_mode}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        work_mode: e.target.value,
                                    }))
                                }
                                label="Job Location"
                                size='sm'
                                description="Select a type of Job Location for your candidate."
                                isDisabled={disabled}
                                isRequired>
                                {SelectList.JobLocation.map((item: any, i) =>
                                    <RadioBox value={item} key={i}>
                                        {item}
                                    </RadioBox>
                                )}
                            </RadioGroup>
                        </div>
                        <div className={`relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5`}>Salary / annum</div>
                        <div className='flex w-full mt-3 mb-8 flex-nowrap'>
                            <Input isDisabled={disabled}
                                value={jobDetails?.salary_range_min?.toString() || ""}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        salary_range_min: e.target.value,
                                    }))
                                }
                                type="text"
                                classNames={{
                                    inputWrapper: 'rounded-r-none'
                                }}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">₹</span>
                                    </div>
                                }
                                variant="bordered"
                                label="Minimum Salary"
                                isRequired />
                            <div className='bg-default-200 border-default-200 flex items-center px-5 min-10 h-14'>To</div>
                            <Input isDisabled={disabled}
                                value={jobDetails?.salary_range_max?.toString() || ""}
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        salary_range_max: e.target.value,
                                    }))
                                }
                                type="text"
                                classNames={{
                                    inputWrapper: 'rounded-l-none'
                                }}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">₹</span>
                                    </div>
                                }
                                variant="bordered"
                                label="Maximum Salary"
                                isRequired />
                        </div>
                        <div className='mb-8'>
                            <Select
                                items={languageList || []}
                                variant="flat"
                                label="Language Preference"
                                isMultiline={true}
                                selectionMode="multiple"
                                placeholder="Select language(s)"
                                classNames={{
                                    base: "w-full",
                                    trigger: "min-h-12 py-2",
                                    listboxWrapper: "nextui-listbox relative"
                                }}
                                selectedKeys={languageValues}
                                isDisabled={disabled}
                                onSelectionChange={setLanguageValues}
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
                                        <div className=''>
                                            {item.name}
                                            <span className='border border-slate-500 absolute right-1 w-5 h-5'></span>
                                        </div>
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap *:basis-full md:*:basis-1/2'>
                            <Select label="Gender" selectedKeys={[jobListing?.gender]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
                                        ...prev,
                                        gender: e.target.value,
                                    }))
                                }>
                                {SelectList.Gender.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Job Shift" selectedKeys={[jobDetails?.job_shift]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        job_shift: e.target.value,
                                    }))
                                }>
                                {SelectList.JobShift.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select label="Mode of Interview" selectedKeys={[jobDetails?.interview_mode]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobDetails((prev: any) => ({
                                        ...prev,
                                        interview_mode: e.target.value,
                                    }))
                                }>
                                {SelectList.InterviewMode.map((item) => (
                                    <SelectItem key={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </Select>
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
                                selectedKey={jobListing.area}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                            >
                                {(item: any) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                        <div className='mb-8'>
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
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='contact' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Contact Details</div>
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
                    <a className={`${activeEl === 'jobDetails' && 'active'}`} href='#jobDetails'>Job Details</a>
                    <a className={`${activeEl === 'location' && 'active'}`} href='#location'>Location</a>
                    <a className={`${activeEl === 'contact' && 'active'}`} href='#contact'>Contact</a>
                </div>
            </div>
        </>
    )
}

export default Page