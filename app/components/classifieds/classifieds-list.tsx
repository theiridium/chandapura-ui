import ClassifiedsCard from "./classifieds-card"
import { getPublicApiResponse } from "@/lib/apiLibrary";

type data = {
  data?: [];
  meta: [];
}

const ClassifiedsList = async () => {
  let classifiedsList: any;
  await getPublicApiResponse("properties?pagination%5BpageSize%5D=4&populate=listing_manager").then((x: any) => classifiedsList = x);
  return (
    <>
      {classifiedsList.data.map((property: any, i: any) => (
        <ClassifiedsCard key={i} list={property} />
      ))}
    </>
  )
}

export default ClassifiedsList