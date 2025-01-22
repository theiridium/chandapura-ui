import ViewLocationMap from '@/app/components/maps/view-location-map'
import Breadcrumb from '@/app/sub-components/breadcrumb'
import ContactButton from '@/app/sub-components/contact-btn'
import { ConvertCurrencyToWords } from '@/lib/helpers'
import { Banknote, IndianRupee, MapPin } from 'lucide-react'
import React from 'react'

const JobDetailPersonal = ({ data, job_details }: any) => {
    return (
        <div className="lg:col-span-3">
            <div className="lg:border border-gray-300 rounded-xl bg-white lg:p-7 gap-x-5 lg:gap-x-7">
                <div className='p-5 lg:p-0'>
                    <div className='flex-none lg:flex justify-between mb-8 lg:mb-12'>
                        <div className="lg:hidden"><Breadcrumb /></div>
                        <div className='flex flex-row gap-5 items-center mt-5 lg:mt-0'>
                            <div className="*:h-20 *:aspect-square *:border *:border-gray-300 *:rounded-xl *:object-contain">
                                {data.logo_image === null ?
                                    <img src="/images/icons/company-logo-placeholder.png" /> :
                                    <img src={data.logo_image.url} />}
                            </div>
                            <div className=''>
                                <div className='text-md lg:text-lg font-semibold text-slate-700'>{data.job_title}</div>
                                <div className='text-xs md:text-sm text-slate-600'>{job_details.company_name}</div>
                            </div>
                        </div>
                    </div>
                    <div className='mb-12'>
                        <div className='flex flex-col md:flex-row justify-between mb-12 *:text-sm *:lg:text-base *:text-slate-600 gap-5'>
                            <div className="flex items-center"><MapPin size={15} className='mr-1' /><span>{data.area.name}, Bengaluru</span></div>
                            <div className="flex items-center"><Banknote size={18} className='mr-2' /><IndianRupee className='h-4' /> {ConvertCurrencyToWords(job_details.salary_range_min)} - <IndianRupee className='h-4' /> {ConvertCurrencyToWords(job_details.salary_range_max)} monthly</div>
                        </div>
                    </div>
                    {data.full_address && <>
                        <hr className='mb-12' />
                        <div className='mb-12'>
                            <div className='text-sm text-gray-500 font-semibold'>Job Details</div>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-7'>
                                {!!data.full_address && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/location.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Work Location</div>
                                        <div className='text-base'>{data.full_address}</div>
                                    </div>
                                </div>}
                                {!!job_details.job_type && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/workspace.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Job Type</div>
                                        <div className='text-base'>{job_details.job_type}</div>
                                    </div>
                                </div>}
                                {!!job_details.job_shift && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/sun.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Job Shift</div>
                                        <div className='text-base'>{job_details.job_shift}</div>
                                    </div>
                                </div>}
                                {!!job_details.work_mode && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/office.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Work Mode</div>
                                        <div className='text-base'>{job_details.work_mode}</div>
                                    </div>
                                </div>}
                                {!!job_details.educational_qualification && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/education.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Educational Qualification</div>
                                        <div className='text-base'>{job_details.educational_qualification}</div>
                                    </div>
                                </div>}
                                {!!job_details.job_experience && <div className='flex w-full gap-2'>
                                    <span>
                                        <img src="/images/icons/primary/briefcase.png" />
                                    </span>
                                    <div>
                                        <div className='text-sm text-gray-700 font-semibold'>Experience</div>
                                        {job_details.job_experience === "Experienced" ?
                                            <div className='text-base'>{job_details.experience_in_years}</div> :
                                            <div className='text-base'>{job_details.job_experience}</div>}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </>}
                    <hr className='mb-12' />
                    <div className='mb-12'>
                        <ContactButton name={data.contact.contact_name} phone={data.contact.contact_number} maskedText={"Owner"} />
                    </div>
                    <hr className='mb-12' />
                    <div className='mb-12'>
                        <div className='text-sm text-gray-500 font-semibold'>Other Details</div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-7'>
                            {!!job_details.open_positions && <div>
                                <div className='text-sm text-gray-700 font-semibold'>Number of Open Postions</div>
                                <div className='text-base'>{job_details.open_positions}</div>
                            </div>}
                            {!!data.gender && <div>
                                <div className='text-sm text-gray-700 font-semibold'>Gender</div>
                                <div className='text-base'>{data.gender}</div>
                            </div>}
                        </div>
                    </div>
                    {data.preferred_languages.length > 0 && <><hr className='mb-12' />
                        <div className='mb-12'>
                            <h5 className='text-sm text-gray-500 font-semibold mb-5'>Preferred Languages</h5>
                            <div className="tags">
                                {data.preferred_languages.map((x: any, i: any) =>
                                    <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.name}</div>
                                )}
                            </div>
                        </div>
                    </>}
                    {/* <hr className='mb-12' />
                    <div className='mb-12'>
                        <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
                        <ViewLocationMap coordinates={data.location.coordinates} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default JobDetailPersonal