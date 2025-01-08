"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';
import FormLoading from '@/app/loading-components/form-loading';
import { useSession } from 'next-auth/react';
import { Products } from '@/public/shared/app.config';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { toast } from 'react-toastify';
import { ListingWorkflow } from '@/lib/typings/enums';

const Page = () => {
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { data }: any = useSession();
    const userData = data?.user;
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const source = searchParams.get('source');
    const [apiRes, setApiRes] = useState<any>();

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
            else if (type === "new" || type === "renew") {
                let payload = {
                    step_number: ListingWorkflow.Publish
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

    return (
        <>
            {isSubmitLoading && <FormLoading text={"Publishing your Job Listing..."} />}
            <div className='col-span-full lg:col-span-6 mt-3 lg:my-8'>
                <div className='listing-header mb-8'>
                    <div className='text-xl lg:text-4xl font-semibold text-gray-700 px-7'>Review & Publish</div>
                </div>
                {isLoading ? "Loading..." :
                    <div className='grid grid-cols-1 gap-10 mx-2'>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>General</div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Company Name</div>
                                <div>{apiRes.name}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Job Title</div>
                                <div>{apiRes.job_title}</div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Job Description</div>
                                <div>{apiRes.job_description}</div>
                            </div>
                        </div>
                        <div className='listing-card border rounded-lg p-5 md:px-7 md:py-6'>
                            <div className='card-header text-xl font-semibold mb-5'>Job Details</div>
                            <div className='flex flex-col md:flex-row gap-4 *:basis-full md:*:basis-1/3 mb-5'>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Job Type</div>
                                    <div>{apiRes.job_type}</div>
                                </div>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Number of Vacancies</div>
                                    <div>{apiRes.open_positions}</div>
                                </div>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Educational Qualification</div>
                                    <div>{apiRes.educational_qualification}</div>
                                </div>
                            </div>
                            <div className='flex flex-col md:flex-row gap-4 *:basis-full md:*:basis-1/2 mb-5'>
                                <div >
                                    <div className='text-sm mb-1 font-semibold'>Job Experience</div>
                                    <div>{apiRes.job_experience}</div>
                                    {apiRes?.job_experience === "Experienced" &&
                                        <div>{apiRes.experience_in_years}</div>
                                    }
                                </div>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Job Location</div>
                                    <div>{apiRes.work_mode}</div>
                                </div>
                            </div>
                            <div className='mb-5'>
                                <div className='text-sm mb-1 font-semibold'>Salary per month</div>
                                <div>₹ {apiRes.salary_range_min} - ₹ {apiRes.salary_range_max}</div>
                            </div>
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
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Job Shift</div>
                                    <div>{apiRes.job_shift}</div>
                                </div>
                                <div>
                                    <div className='text-sm mb-1 font-semibold'>Mode of Interview</div>
                                    <div>{apiRes.interview_mode}</div>
                                </div>
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
                        <div className='flex gap-x-5 justify-end text-xl *:w-auto *:rounded-lg *:mb-5 *:py-2 *:px-5 *:block font-semibold'>
                            <Button className='btn-primary text-base' color='primary' isLoading={isSubmitLoading} onPress={onClickSave}>
                                {!isSubmitLoading && "Publish"}
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <div className='col-span-2 mt-3 lg:my-8'>
                <div className='form-nav'>

                </div>
            </div>
        </>
    )
}

export default Page