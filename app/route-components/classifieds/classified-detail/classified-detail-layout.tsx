import { getPublicApiResponse } from "@/lib/apiLibrary";
import ClassifiedsDetail from "./classified-detail";
import { Products } from "@/public/shared/app.config";
import Breadcrumb from "@/app/sub-components/breadcrumb";

const ClassifiedDetailLayout = async ({ id }: any) => {
    const attr = Products.classifieds.api;
    const { data } = await getPublicApiResponse(`${attr.base}?populate=${attr.populateDetails}&filters[id]=${id}`);
    const item = data[0];
    return (
        <>
            <div className="hidden lg:block"><Breadcrumb /></div>
            <ClassifiedsDetail data={item} />
        </>
    )
}

export default ClassifiedDetailLayout