import { ConvertCurrencyToWords } from "@/lib/helpers"
import { Products } from "@/public/shared/app.config"
import { IndianRupee } from "lucide-react"

const ProductItemsCard = ({ data, id, product }: any) => {
    let productSlug = data.listing_type === "Rent" ? Products.rent.url : Products.sale.url;
    let detailsComp = "";
    switch (data.listing_type) {
        case "Rent":
            detailsComp = Products.rent.api.component;
            break;
        case "Sale":
            data.property_type === "Plot" ? detailsComp = Products.plot.api.component :
                detailsComp = Products.sale.api.component;;
            break;
        default:
            break;
    }
    let property_details = data.details_by_listingtype.find((x: any) => x.__component == detailsComp);
    return (
        <a className="card_link" href={`/${productSlug}/${data.slug}?source=${id}`}>
            <div className="border border-gray-300 rounded-xl bg-white">
                <div className="flex-none md:flex p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                    <div className="flex-none w-full h-[230px] md:w-[300px] md:h-[200px] mb-5 md:mb-0 *:object-cover">
                        {data.featured_image === null ?
                            <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                            <img src={data.featured_image.url} className="w-full h-full rounded-xl" />}
                    </div>
                    <div className="w-full flex flex-col justify-between lg:overflow-auto">
                        <div>
                            <h2 className="md:text-lg font-medium mb-2">{data.property_type !== "Plot" && property_details.room_type + " "}{data.property_type} for {data.listing_type} in {data.area.name}</h2>
                            <h3 className="font-semibold mb-5 text-gray-500">{data.name}</h3>
                            {data.property_type !== "Plot" &&
                                <div className="flex flex-wrap gap-x-3 md:gap-x-5 text-xs md:text-sm mb-3 text-gray-500 font-medium">
                                    <div className="mb-2">
                                        {property_details.carpet_area} Sqft
                                    </div>
                                    <div className="mb-2">
                                        {property_details.bathrooms} Bathrooms
                                    </div>
                                    <div className="mb-2">
                                        {property_details.parking_type} Parking
                                    </div>
                                    <div className="mb-2">
                                        {property_details.direction} Facing
                                    </div>
                                </div>
                            }
                            <div className="tags">
                                {property_details?.amenities.map((x: any, i: any) =>
                                    <div className="px-3 py-1 bg-color2d/70 font-semibold rounded-xl text-xs text-nowrap text-gray-600" key={i}>{x.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex justify-between lg:justify-normal gap-x-6">
                            <div className="text-xl font-semibold text-gray-600 flex items-center"><IndianRupee size={20} />{data.listing_type === "Sale" ? ConvertCurrencyToWords(property_details?.selling_amount) : ConvertCurrencyToWords(property_details.rental_amount)}</div>
                            <button className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full h-fit text-center text-sm">Contact Owner</button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default ProductItemsCard