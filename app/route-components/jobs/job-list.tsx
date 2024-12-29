import { Products } from "@/public/shared/app.config";
import JobCard from "./job-card";
import ListArrow from "./list-arrow";
import { getPublicApiResponse } from "@/lib/apiLibrary";

const JobList = async () => {
  const attr = Products.job.api;
  const jobList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&populate=${attr.populateList}`);
  return (
    <>
      <div className="job-card-list-row">
        {jobList.data.map((item: any, i: any) => (
          <JobCard key={i} list={item} id={item.id} />
        ))}
      </div>
      <ListArrow size={400} row="job-card-list-row" infinite={true} />
    </>
  )
}

export default JobList