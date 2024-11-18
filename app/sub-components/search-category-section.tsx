import { getPublicApiResponse } from "@/lib/apiLibrary";
import { Products } from "@/public/shared/app.config";
import Image from "next/image"
import { it } from "node:test";
import { useEffect, useState } from "react";
import ListArrow from "../route-components/business/list-arrow";

const SearchCategorySection = ({ productType }: any) => {
    const [categories, SetCategories] = useState([]);
    const getCategoryList = async () => {
        const { data } = await getPublicApiResponse(`categories?populate=image&sort=name`);
        SetCategories(data);
    }
    useEffect(() => {
        if (productType === Products.business.productType) {
            getCategoryList();
        }
    }, [productType])

    return (
        <>
            {(productType === Products.business.productType && categories.length > 0) &&
                <div className="relative">
                    <div className="search-cat-sec">
                        {categories.map((item: any, i) =>
                            <a href={`${Products.business.url}/${item.slug}`} className='mini-card' key={i}>
                                <Image src={item.image.url} width={50} height={50} alt="" />
                                <div className='text'>{item.name}</div>
                            </a>
                        )}
                    </div>
                    <ListArrow size={400} row="search-cat-sec" infinite={false} minirow={"top-1/3"} displayInMobile={true} />
                </div>
            }
            {(productType === Products.sale.productType) &&
                <div className="search-cat-sec justify-center">
                    <a href={Products.sale.url} className='mini-card'>
                        <Image src={'/images/icons/sale-re.png'} width={50} height={50} alt="" />
                        <div className='text'>On Sale Property</div>
                    </a>
                    <a href={Products.rent.url} className='mini-card'>
                        <Image src={'/images/icons/rent-re.png'} width={50} height={50} alt="" />
                        <div className='text'>Rental Property</div>
                    </a>
                </div>
            }
        </>
    )
}

export default SearchCategorySection