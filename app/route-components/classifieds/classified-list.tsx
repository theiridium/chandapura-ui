import { Products } from "@/public/shared/app.config";
import ClassifiedCard from "./classified-card";
import { getPublicApiResponse } from "@/lib/apiLibrary";
import ListArrow from "@/app/sub-components/list-arrow";

const ClassifiedList = async () => {
  const attr = Products.classifieds.api;
  const classifiedList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&populate=${attr.populateList}`);
  return (
    <>
      <div className="card-list-row classified-card">
        {classifiedList.data.map((item: any, i: any) => (
          <ClassifiedCard key={i} list={item} id={item.id} />
        ))}
      </div>
      <ListArrow size={293} row="classified-card" infinite={true} displayArrowLg={classifiedList.data.length > 4} />
    </>
  )
}

export default ClassifiedList