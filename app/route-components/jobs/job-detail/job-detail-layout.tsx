import { getPublicApiResponse } from "@/lib/apiLibrary";
import { Products } from "@/public/shared/app.config";
import Breadcrumb from "@/app/sub-components/breadcrumb";
import JobDetail from "./job-detail";

const JobDetailLayout = async ({ id }: any) => {
    const attr = Products.job.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            <JobDetail data={item} />
        </>
    )
}

export default JobDetailLayout