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
    const [jobListing, setJobListing] = useState<JobListing>({
        name: "",
        job_title: "",
        designation: "",
        job_description: "",
        job_type: "",
        work_mode: "",
        educational_qualification: "",
        job_experience: "",
        year_of_experience: "",
        salary_range_min: "",
        salary_range_max: "",
        gender: "",
        job_shift: "",
        interview_mode: "",
        open_positions: 1,
        preferred_languages: languageValues,
        area: "",
        contact: contact,
        step_number: ListingWorkflow.Initial
    });
    const [apiRes, setApiRes] = useState<any>();
    const onAreaChange = (id: any) => setJobListing({ ...jobListing, area: id });

    //In View
    const [activeEl, setActiveEl] = useState("");
    const onViewScroll = useCallback((inView: any, entry: any) => {
        if (inView) setActiveEl(entry.target.id)
    }, [activeEl]);


    useEffect(() => {
        if (apiRes) {
            setContact(apiRes.contact)
            setLanguageValues(new Set(apiRes.preferred_languages.map((item: any) => String(item.id))))
            setJobListing(prev => ({
                ...prev,
                ...apiRes,
                area: apiRes.area.id.toString(),
                contact: apiRes.contact
            }));
        }
    }, [apiRes])

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

    useEffect(() => {
        console.log(jobListing)
    }, [jobListing])

    const handleContactDetails = (data: any) => setContact(data);

    const onSubmit: SubmitHandler<any> = (data) => {
        setIsSubmitLoading(true);
        let formdata = { ...data, jobListing }
        const payload: JobListing = {
            ...jobListing,
            name: formdata.name,
            job_title: formdata.job_title,
            designation: formdata.designation,
            job_description: formdata.job_description,
            salary_range_min: formdata.salary_range_min,
            salary_range_max: formdata.salary_range_max,
            preferred_languages: languageValues,
            contact: contact,
            step_number: ListingWorkflow.AddDetails
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
                        <div className="mb-8">
                            <Controller
                                control={control}
                                name='name'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("name")}
                                        value={value}
                                        type="text"
                                        variant="flat"
                                        label="Company Name"
                                        isRequired />
                                )}
                            />
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
                    </InView>
                    <InView as="div" threshold={1} onChange={onViewScroll} id='jobDetails' className='listing-card border rounded-lg px-4 lg:px-7 py-6 scroll-mt-36'>
                        <div className='card-header text-xl font-semibold mb-5'>Job Details</div>
                        <div className='flex w-full gap-8 lg:gap-4 mt-3 mb-8 flex-wrap md:flex-nowrap'>
                            <Select label="Job Type" selectedKeys={[jobListing?.job_type]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
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
                            <Select label="Number of Vacancies" selectedKeys={[(jobListing.open_positions)?.toString()]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
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
                            <Select label="Educational Qualification" selectedKeys={[jobListing?.educational_qualification]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
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
                                value={jobListing?.job_experience}
                                onChange={(e: any) =>
                                    setJobListing({
                                        ...jobListing,
                                        job_experience: e.target.value
                                    })
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
                        {jobListing?.job_experience === "Experienced" && <div className='mb-8'>
                            <RadioGroup
                                value={jobListing?.year_of_experience}
                                onChange={(e: any) =>
                                    setJobListing({
                                        ...jobListing,
                                        year_of_experience: e.target.value
                                    })
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
                                value={jobListing?.work_mode}
                                onChange={(e: any) =>
                                    setJobListing({
                                        ...jobListing,
                                        work_mode: e.target.value
                                    })
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
                        <div className={`relative text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5`}>Salary / month</div>
                        <div className='flex w-full mt-3 mb-8 flex-nowrap'>
                            <Controller
                                control={control}
                                name='salary_range_min'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("salary_range_min")}
                                        value={value}
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
                                )}
                            />
                            <div className='bg-default-200 border-default-200 flex items-center px-5 min-10 h-14'>To</div>
                            <Controller
                                control={control}
                                name='salary_range_max'
                                render={({ field: { value } }) => (
                                    <Input isDisabled={disabled}
                                        {...register("salary_range_max")}
                                        value={value}
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
                                )}
                            />
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
                            <Select label="Job Shift" selectedKeys={[jobListing?.job_shift]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
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
                            <Select label="Mode of Interview" selectedKeys={[jobListing?.interview_mode]}
                                isDisabled={disabled}
                                classNames={{ listboxWrapper: "nextui-listbox" }}
                                isRequired
                                onChange={(e: any) =>
                                    setJobListing((prev: any) => ({
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
                                selectedKey={jobListing.area}
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