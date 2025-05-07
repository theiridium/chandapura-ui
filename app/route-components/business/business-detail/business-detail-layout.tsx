import { getPublicApiResponse } from "@/lib/apiLibrary";
import BusinessDetail from "./business-detail";
import { Products } from "@/public/shared/app.config";
import Breadcrumb from "@/app/sub-components/breadcrumb";
import { notFound } from "next/navigation";

const BusinessDetailLayout = async ({ id }: any) => {
    const attr = Products.business.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}&filters[publish_status]=true`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb blockSecondLast={true} /></div>
            {!item ? notFound() : <BusinessDetail data={item} />}
        </>
    )
}

export default BusinessDetailLayout