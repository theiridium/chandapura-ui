import { Products } from "@/public/shared/app.config";
import Image from "next/image"
import ListArrow from "./list-arrow";
import { useAtomValue } from "jotai";
import { categories, classifiedCategories } from "@/lib/atom";

const SearchCategorySection = ({ productType }: any) => {
    const bizCategoryList = useAtomValue<any>(categories);
    const classifiedCategoryList = useAtomValue<any>(classifiedCategories);
    return (
        <>
            {(productType === Products.business.productType && bizCategoryList?.length > 0) &&
                <div className="relative">
                    <div className="search-cat-sec">
                        {bizCategoryList?.map((item: any, i: any) =>
                            <a href={`${Products.business.url}/${item.slug}`} className='mini-card' key={i}>
                                <div className="relative w-16 h-16 md:w-20 md:h-20">
                                    <Image src={item.image.url} alt={item.name} fill />
                                </div>
                                <div className='text'>{item.name}</div>
                            </a>
                        )}
                    </div>
                    <ListArrow size={400} row="search-cat-sec" infinite={false} minirow={"top-1/3"} displayInMobile={true} displayArrowLg={true} />
                </div>
            }
            {(productType === Products.realEstate.productType) &&
                <div className="search-cat-sec md:justify-center">
                    <a href={Products.sale.url} className='mini-card'>
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image src={'/images/icons/sale-re.png'} fill alt="" />
                        </div>
                        <div className='text'>On Sale Property</div>
                    </a>
                    <a href={Products.rent.url} className='mini-card'>
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image src={'/images/icons/rent-re.png'} fill alt="" />
                        </div>
                        <div className='text'>Rental Property</div>
                    </a>
                    <a href={Products.pg.url} className='mini-card'>
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image src={'/images/icons/pg-re.png'} fill alt="" />
                        </div>
                        <div className='text'>PG Rooms</div>
                    </a>
                </div>
            }
            {(productType === Products.classifieds.productType && classifiedCategoryList?.length > 0) &&
                <div className="relative">
                    <div className="search-cat-sec">
                        {classifiedCategoryList?.map((item: any, i: any) =>
                            <a href={`${Products.classifieds.url}/${item.slug}`} className='mini-card' key={i}>
                                <div className="relative w-16 h-16 md:w-20 md:h-20">
                                    <Image src={item.image.url} fill alt="" />
                                </div>
                                <div className='text'>{item.name}</div>
                            </a>
                        )}
                    </div>
                    <ListArrow size={400} row="search-cat-sec" infinite={false} minirow={"top-1/3"} displayInMobile={true} displayArrowLg={true} />
                </div>
            }
            {(productType === Products.job.productType) &&
                <div className="search-cat-sec justify-center">
                    <a href={`${Products.job.url}/${Products.job.personalJobUrl}`} className='mini-card'>
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image src={'/images/icons/personal-job.png'} fill alt="" />
                        </div>
                        <div className='text'>Personal Services</div>
                    </a>
                    <a href={`${Products.job.url}/${Products.job.corporateJobUrl}`} className='mini-card'>
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <Image src={'/images/icons/corporate-job.png'} fill alt="" />
                        </div>
                        <div className='text'>Corporate Jobs</div>
                    </a>
                </div>
            }
        </>
    )
}

export default SearchCategorySection