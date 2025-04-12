'use client'
import ContactCard from '@/app/sub-components/contact-card';
import { CloudImages, Products } from '@/public/shared/app.config';
import JobDetailCorporate from './job-detail-corporate';
import JobDetailPersonal from './job-detail-personal';

const JobDetail = ({ data }: any) => {
  let detailsComp = <></>;
  const props = {
    data: data,
    job_details: {}
  }
  switch (data.category) {
    case "Corporate":
      props.job_details = data.details_by_jobCategory.find((x: any) => x.__component == Products.job.api.component_corporateJob);
      detailsComp = <JobDetailCorporate {...props} />
      break;
    case "Personal":
      props.job_details = data.details_by_jobCategory.find((x: any) => x.__component == Products.job.api.component_personalJob);
      detailsComp = <JobDetailPersonal {...props} />
      break;
    default:
      <></>
      break;
  }
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
        {detailsComp}
        <div className='lg:col-span-1 relative m-5 lg:m-0'>
          <ContactCard heading="Contact Details" name={data.contact.contact_name} contact={data.contact.contact_number} />
          <div className='hidden lg:block lg:col-span-1 mt-10'>
            <img className='w-full rounded-xl' src={CloudImages.SideBannerBusiness} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail