import { ConvertCurrencyToWords } from "@/lib/helpers"
import { Products, SelectList } from "@/public/shared/app.config"

const PgItemsCard = ({ data, id, product }: any) => {
    let productSlug = Products.pg.url;
    let property_details = data.details_by_listingtype[0];
    if (product.productType !== "real-estate") property_details = data.details_by_listingtype.find((x: any) => x.__component == product.api.component);
    return (
        <a className="card_link" href={`/${productSlug}/${data.slug}?source=${id}`}>
            <div className="border border-gray-300 rounded-xl bg-white">
                <div className="flex-none md:flex p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                    <div className="flex-none w-full h-[230px] md:w-[300px] md:h-[200px] mb-5 md:mb-0 *:object-cover -p-5">
                        {data.featured_image === null ?
                            <img src="/images/placeholder.png" className="w-full h-full rounded-xl" /> :
                            <img src={data.featured_image.url} className="w-full h-full rounded-xl" />}
                    </div>
                    <div className="w-full flex flex-col justify-between lg:overflow-auto">
                        <div>
                            <h2 className="md:text-lg font-medium mb-2">{data.property_type} in {data.area.name}</h2>
                            <h3 className="font-semibold mb-5 md:mb-3 text-gray-500">{data.name}</h3>
                            <div className='mb-5 md:mb-3 flex content-center text-xs  border border-color1d/30 divide-x divide-color1d/30 *:min-w-32 overflow-auto'>
                                {SelectList.OccupancyType.map((x: any, i: any) =>
                                    <div key={i} className={`p-1 w-full h-full flex flex-col items-center justify-center
                                                         ${!!property_details?.occupancy_type?.[x.name]?.toString() && property_details?.occupancy_type?.[x.name] > 0 && ' bg-color1d/30'}`}>
                                        <div>{x.label}</div>
                                        <div className="font-medium">{(property_details?.occupancy_type?.[x.name] && (`₹ ${ConvertCurrencyToWords(property_details?.occupancy_type?.[x.name])}`)) || "Not Available"}</div>
                                    </div>
                                )}
                            </div>
                            <div className="tags mb-5 md:mb-2">
                                {property_details.amenities.map((x: any, i: any) =>
                                    <div className="px-3 py-1 bg-color2d/70 font-semibold rounded-xl text-xs text-nowrap text-gray-600" key={i}>{x.name}</div>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex justify-between lg:justify-normal gap-x-6">
                            <button className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full h-fit text-center text-sm">Contact Owner</button>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default PgItemsCard