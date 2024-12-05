import { Phone } from "lucide-react"

const ClassifiedItemsCard = ({ data, id, product }: any) => {
    return (
        <a className="card_link" href={`/${product.slug}/${data.category.slug}/${data.slug}?source=${id}`}>
            <div className="border border-gray-300 rounded-xl bg-white">
                <div className="flex-none md:flex p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                    <div className="flex-none w-full h-[230px] lg:w-[300px] lg:h-[200px] mb-5 md:mb-0 *:object-fill">
                        {data.featured_image === null ?
                            <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                            <img src={data.featured_image.url} className="w-full h-full rounded-xl" />}
                    </div>
                    <div className="w-full flex flex-col">
                        <h2 className="md:text-lg font-medium mb-2">{data.category.name} for sale in {data.area.name}</h2>
                        <h3 className="font-semibold mb-3 text-gray-500">{data.name}</h3>
                        {data.description && <div className="flex flex-wrap gap-x-5 text-sm mb-3 text-gray-500 truncate-2">{data.description}</div>}
                        {data.tags && <div className="tags">
                            {data.tags.map((x: any, i: any) =>
                                <div className="px-3 py-1 bg-color2d/70 font-semibold rounded-xl text-xs text-nowrap text-gray-600" key={i}>{x.trim()}</div>
                            )}
                        </div>}
                        <div className="w-full flex justify-between lg:justify-normal gap-x-6">
                            <button className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full h-fit text-center flex items-center gap-x-2 text-sm"><Phone size={16} fill='#fff' stroke='none' />+91 {data.contact.contact_number}</button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default ClassifiedItemsCard