import { getPublicApiResponse } from "@/lib/apiLibrary";
import { Products } from "@/public/shared/app.config";
import Breadcrumb from "@/app/sub-components/breadcrumb";
import JobDetail from "./job-detail";
import { notFound } from "next/navigation";

const JobDetailLayout = async ({ id }: any) => {
    const attr = Products.job.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}&filters[publish_status]=true`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            {!item ? notFound() : <JobDetail data={item} />}
        </>
    )
}

export default JobDetailLayout