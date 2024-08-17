import { getPublicApiResponse } from "@/lib/apiLibrary";
import BusinessDetail from "./business-detail";
import { Products } from "@/public/shared/app.config";
import Breadcrumb from "@/app/sub-components/breadcrumb";

const BusinessDetailLayout = async ({ id }: any) => {
    const attr = Products.business.api;
    const { data } = await getPublicApiResponse(`${attr.base}?${attr.populate}&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <Breadcrumb blockSecondLast={true} />
            <BusinessDetail data={item} />
        </>
    )
}

export default BusinessDetailLayout