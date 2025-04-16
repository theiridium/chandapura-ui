import { Products } from '@/public/shared/app.config';
import React from 'react';
import { IndianRupee, MapPin, Banknote } from 'lucide-react';
import { ConvertCurrencyToWords } from '@/lib/helpers';

const JobCardCorporate = (p: any) => {
    const item = p.list;
    const id = p.id;
    const job_details = item.details_by_jobCategory.find((x: any) => x.__component == Products.job.api.component_corporateJob);
    return (
        <>
            {!!job_details && <a href={`${Products.job.url}/${item.category}/${item.slug}?source=${id}`} className="re-card-link">
                <div className="job-card p-5">
                    <div className='flex flex-row gap-5 items-center'>
                        <div className="basis-1/5 *:aspect-square">
                            {item.logo_image === null ?
                                <img src="/images/icons/company-logo-placeholder.png" /> :
                                <img src={item.logo_image.url} />}
                        </div>
                        <div className='basis-4/5'>
                            <div className='text-md lg:text-lg font-semibold text-slate-700'>{item.job_title}</div>
                            <div className='text-xs md:text-sm text-slate-600'>{job_details.company_name}</div>
                        </div>
                    </div>
                    <div className="text-xs font-bold mt-5 mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{item.area.name}</span></div>
                    <div className="text-sm text-slate-600 mb-5 flex items-center"><Banknote size={15} className='mr-2' /><IndianRupee size={15} /> {ConvertCurrencyToWords(job_details.salary_range_min)} - <IndianRupee size={15} /> {ConvertCurrencyToWords(job_details.salary_range_max)} {job_details?.salary_type}</div>
                    <div className='flex overflow-auto'>
                        <div className='job-card-tags'>
                            <div>{job_details.job_type}</div>
                            <div>{job_details.work_mode}</div>
                            {job_details.experience_in_years && <div>Min. {job_details.experience_in_years} of exp</div>}
                            <div>{job_details.job_shift}</div>
                        </div>
                    </div>
                </div>
            </a>}
        </>
    )
}

export default JobCardCorporate