import { ConvertCurrencyToWords } from "@/lib/helpers"
import { IndianRupee } from "lucide-react"

const ProductItemsCard = ({ data, id, product }: any) => {
    return (
        <a className="card_link" href={`${product.slug}/${data.slug}?source=${id}`}>
            <div className="border border-gray-300 rounded-xl bg-white">
                <div className="flex-none md:flex p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                    <div className="flex-none w-full h-[230px] lg:w-[300px] lg:h-[200px] mb-5 md:mb-0">
                        {data.featured_image === null ?
                            <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                            <img src={data.featured_image.url} className="w-full h-full rounded-xl" />}
                    </div>
                    <div className="w-full flex flex-col">
                        <h2 className="md:text-lg font-medium mb-2">{data.property_details.rooms} {data.property_details.type} for {data.property_details.listing_type} in {data.property_details.area}</h2>
                        <h3 className="font-semibold mb-5 text-gray-500">{data.name}</h3>
                        <div className="flex flex-wrap gap-x-3 md:gap-x-5 text-xs md:text-sm mb-3 text-gray-400 font-semibold">
                            <div className="mb-2">
                                {data.property_details.carpet_area} Sqft
                            </div>
                            <div className="mb-2">
                                {data.property_details.bathrooms} Bathrooms
                            </div>
                            <div className="mb-2">
                                {data.property_details.parking_type} Parking
                            </div>
                            <div className="mb-2">
                                {data.property_details.facing} Facing
                            </div>
                        </div>
                        <div className="tags">
                            {data.amenities.map((x: any, i: any) =>
                                <div className="px-3 py-1 bg-color2d/70 font-semibold rounded-xl text-xs text-nowrap text-gray-600" key={i}>{x.title}</div>
                            )}
                        </div>
                        <div className="w-full flex justify-between lg:justify-normal gap-x-6">
                            <div className="text-xl font-semibold text-gray-600 flex items-center"><IndianRupee size={20} />{data.property_details.listing_type === "Sale" ? ConvertCurrencyToWords(data.property_details.selling_amount) : ConvertCurrencyToWords(data.property_details.rental_amount)}</div>
                            <button className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full h-fit text-center text-sm md:text-base">Contact Owner</button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default ProductItemsCard