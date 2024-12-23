import { Products } from "@/public/shared/app.config";
import ClassifiedCard from "./classified-card";
import ListArrow from "./list-arrow";
import { getPublicApiResponse } from "@/lib/apiLibrary";

const ClassifiedList = async () => {
  const attr = Products.classifieds.api;
  const classifiedList = await getPublicApiResponse(`${attr.base}?sort=publishedAt%3A${attr.sort}&${attr.isPublishedFilter}&populate=${attr.populateList}`);
  return (
    <>
      <div className="card-list-row">
        {classifiedList.data.map((item: any, i: any) => (
          <ClassifiedCard key={i} list={item} id={item.id} />
        ))}
      </div>
      <ListArrow size={400} row="card-list-row" infinite={true} />
    </>
  )
}

export default ClassifiedList