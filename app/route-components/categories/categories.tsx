import { getPublicApiResponse } from "@/lib/interceptor";
import { Products } from "@/public/shared/app.config";

const Categories = async ({ slug }: any) => {
    const { data } = await getPublicApiResponse(`categories?filters[slug][$eq]=${slug}&populate[0]=sub_categories`);
    return (
        <>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-600 mb-12">{data[0].name}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-7 m-auto">
                {data[0].sub_categories.map((x: any, i: any) =>
                    <a key={i} href={`/${Products.business.slug}/${data[0].slug}/${x.slug}`} className="border-t-1 last:border-b-1 lg:[&:nth-last-child(3)]:border-b-1 lg:[&:nth-last-child(2)]:border-b-1 text-slate-500 hover:text-color1d py-4 px-7 text-xl font-semibold text-center h-[88px] flex items-center justify-center">{x.name}</a>
                )}
            </div>
        </>
    )
}

export default Categories