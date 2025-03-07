"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Link } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { useSession } from 'next-auth/react';
import { Products, Resource } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';
import { JobCategory, ListingWorkflow } from '@/lib/typings/enums';
import { useSetAtom } from 'jotai';
import { listingFormBtnEl } from '@/lib/atom';

const Page = () => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const setListingFormBtnEl = useSetAtom(listingFormBtnEl);
    const [apiRes, setApiRes] = useState<any>();
    const [jobDetails, setJobDetails] = useState<any>();

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            if (source) {
                const attr = Products.job.api;
                let apiUrl = `${attr.base}?${attr.userFilter}=${userData?.email}&filters[id][$eq]=${source}&populate=*`;
                const response = await getPublicApiResponse(apiUrl).then(res => res.data);
                const data = response[0];
                if (data) {
                    // if (data.step_number !== ListingWorkflow.UploadImages) router.push(`/dashboard/job-listing/view-all`);
                    setApiRes(data);
                    setJobDetails(data.details_by_jobCategory[0])
                    setIsLoading(false);
                    return data;
                }
                else window.location.replace('/');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const onClickSave = async () => {
        try {
            setIsSubmitLoading(true);

            if (type === "edit") {
                toast.info("Redirecting to listing menu...")
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push(`/dashboard/job-listing/view-all`)
            }
            else if (type === "new" || type === "renew" || type === 'edit_back') {
                let payload = {
                    step_number: ListingWorkflow.Payment
                }
                const endpoint = Products.job.api.base;
                const response = await putRequestApi(endpoint, payload, source);
                if (response.data) {
                    toast.success("Your job product has been uploaded sucessfully!");
                    router.push(`/dashboard/job-listing/view-all`)
                }
            }
        } catch (error) {
            console.error("An error occurred during the process:", error);
            toast.error("Failed to publish. Please contact our support team.");
        } finally {
            setIsSubmitLoading(false);
        }
    }

    const setFormBtnEl = () => (
        <div key={1} className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg p-2 *:py-2 *:px-5 *:block font-semibold'>
            <Button className='btn-primary text-base' color='primary' isDisabled={isLoading} isLoading={isSubmitLoading} onPress={onClickSave}>
                {!isSubmitLoading && "Submit"}
            </Button>
        </div>
    );

    useEffect(() => {
        setListingFormBtnEl([setFormBtnEl()]);
    }, [isSubmitLoading, isLoading])

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Publishing your Job Listing..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8 order-3 lg:order-2'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review & Publish</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Job Category</div>
                                <div>{apiRes.category}</div>
                            </div>
                            {apiRes.category === JobCategory.Corporate && <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Company Name</div>
                                <div>{jobDetails.company_name}</div>
                            </div>}
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Job Title</div>
                                <div>{apiRes.job_title}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Job Details</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Job Description</div>
                                <div>{apiRes.job_description}</div>
                            </div>
                            {apiRes.category === JobCategory.Corporate &&
                                <>
                                    <div className='flex flex-col md:flex-row gap-4 *:basis-full md:*:basis-1/3 mb-5'>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Job Type</div>
                                            <div>{jobDetails.job_type}</div>
                                        </div>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Number of Vacancies</div>
                                            <div>{jobDetails.open_positions}</div>
                                        </div>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Educational Qualification</div>
                                            <div>{jobDetails.educational_qualification}</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col md:flex-row gap-4 *:basis-full md:*:basis-1/2 mb-5'>
                                        <div >
                                            <div className='text-sm mb-1 font-semibold'>Job Experience</div>
                                            <div>{jobDetails.job_experience}</div>
                                            {jobDetails?.job_experience === "Experienced" &&
                                                <div>{jobDetails.experience_in_years}</div>
                                            }
                                        </div>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Job Location</div>
                                            <div>{jobDetails.work_mode}</div>
                                        </div>
                                    </div>
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Salary per annum</div>
                                        <div>₹ {jobDetails.salary_range_min} - ₹ {jobDetails.salary_range_max}</div>
                                    </div>
                                </>}
                            {apiRes.category === JobCategory.Personal &&
                                <>
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Preferred Work Timings</div>
                                        <div className='flex gap-10'>
                                            <div>
                                                <div className='text-xs'>From</div>
                                                <div>{jobDetails.job_timing_from}</div>
                                            </div>
                                            <div>
                                                <div className='text-xs'>To</div>
                                                <div>{jobDetails.job_timing_to}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-5'>
                                        <div className='text-sm mb-1 font-semibold'>Salary per month</div>
                                        <div>₹ {jobDetails.salary_range_min} - ₹ {jobDetails.salary_range_max}</div>
                                    </div>
                                </>
                            }
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Preferred Languages</div>
                                {apiRes.preferred_languages &&
                                    <div className="tags">
                                        {apiRes.preferred_languages.map((x: any, i: any) =>
                                            <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.name}</div>
                                        )}
                                    </div>}
                            </div>
                            <div className='flex flex-col md:flex-row gap-4 *:basis-full md:*:basis-1/3 mb-5'>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Gender</div>
                                    <div>{apiRes.gender}</div>
                                </div>
                                {apiRes.category === JobCategory.Corporate &&
                                    <>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Job Shift</div>
                                            <div>{jobDetails.job_shift}</div>
                                        </div>
                                        <div>
                                            <div className='text-sm mb-1 font-semibold'>Mode of Interview</div>
                                            <div>{jobDetails.interview_mode}</div>
                                        </div>
                                    </>}
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Location</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Area</div>
                                <div>{apiRes.area.name}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Contact Details</div>
                            <div className='flex flex-col md:flex-row *:basis-full *:md:basis-1/3'>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Contact Name</div>
                                    <div>{apiRes.contact.contact_name}</div>
                                </div>
                                <div className='mb-5'>
                                    <div className='text-sm mb-1 font-semibold'>Conatct Number</div>
                                    <div>{apiRes.contact.contact_number}</div>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Contact Email ID</div>
                                <div>{apiRes.contact.contact_email_id}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Logo Image</div>
                            {apiRes.logo_image ? <img src={apiRes.logo_image.url} /> : "No logo image uploaded"}
                        </div>
                    </div>
                }
            </div>
            <div className='col-span-full lg:col-span-2 mt-3 lg:my-8 mx-5 lg:mx-2 order-2 lg:order-3'>
                <div className='flex flex-row lg:flex-col gap-5'>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='flat' href={Resource.JobListing.addDetailsLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Details</Button>
                    <Button className='btn-primary text-base' isDisabled={isLoading} radius='sm' variant='ghost' href={Resource.JobListing.uploadImagesLink + '?type=edit_back&source=' + apiRes?.id} color='primary' as={Link}>Edit Images</Button>
                </div>
            </div>
        </>
    )
}

export default Page