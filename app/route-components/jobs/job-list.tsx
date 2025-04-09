import { Products } from "@/public/shared/app.config";
import JobCardCorporate from "./job-card-corporate";
import { getPublicApiResponse } from "@/lib/apiLibrary";
import ListArrow from "@/app/sub-components/list-arrow";
import JobCardPersonal from "./job-card-personal";

const JobList = async () => {
  const attr = Products.job.api;
  const jobList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&populate=${attr.populateList}&pagination%5Blimit%5D=15`);
  return (
    <>
      <div className="job-card-list-row">
        {jobList.data.map((item: any, i: any) => (
          item.category === "Corporate"?
          <JobCardCorporate key={i} list={item} id={item.id} />:
          <JobCardPersonal key={i} list={item} id={item.id} />
        ))}
      </div>
      <ListArrow size={424} row="job-card-list-row" infinite={true} displayArrowLg={jobList.data.length > 3} />
    </>
  )
}

export default JobList