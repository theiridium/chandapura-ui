import { ConvertCurrencyToWords } from "@/lib/helpers"
import { Banknote, IndianRupee, MapPin, Phone } from "lucide-react"

const JobItemsCard = ({ data, id, product }: any) => {
    return (
        <a className="card_link" href={`/${product.slug}/${data.slug}?source=${id}`}>
            <div className="border border-gray-300 rounded-xl bg-white">
                <div className="job-card p-5 w-auto">
                    <div className='flex flex-row gap-5 items-center'>
                        <div className="*:h-16 *:aspect-square">
                            {data.logo_image === null ?
                                <img src="/images/icons/company.png" /> :
                                <img src={data.logo_image.url} />}
                        </div>
                        <div className=''>
                            <div className='text-md lg:text-lg font-semibold text-slate-700'>{data.job_title}</div>
                            <div className='text-xs md:text-sm text-slate-600'>{data.name}</div>
                        </div>
                    </div>
                    <div className="text-xs font-bold mt-5 mb-2 flex items-center"><MapPin size={12} className='mr-1' /><span className='text-highlight'>{data.area.name}</span></div>
                    <div className="text-sm text-slate-600 mb-5 flex items-center"><Banknote size={15} className='mr-2' /><IndianRupee size={15} /> {ConvertCurrencyToWords(data.salary_range_min)} - <IndianRupee size={15} /> {ConvertCurrencyToWords(data.salary_range_max)} monthly</div>
                    <div className='flex overflow-auto'>
                        <div className='job-card-tags'>
                            <div>{data.job_type}</div>
                            <div>{data.work_mode}</div>
                            {data.year_of_experience && <div>Min. {data.year_of_experience} of exp</div>}
                            <div>{data.job_shift}</div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </a>
    )
}

export default JobItemsCard