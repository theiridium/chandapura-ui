import React from 'react'

const ClassifiedsCard = (p: any) => {
    const items = p.list;
    return (
        <a href="#" className="">
            <div className="border rounded-md bg-white">
                <div className="border-b h-40 w-72 lg:w-auto">
                    <img src="/images/placeholder.png" className="w-full h-full" />
                </div>
                <div className="px-4 lg:px-6 h-40 grid content-center">
                    <div className="grid grid-cols-2">
                        <div className="mb-2">{items.type}</div>
                        <div className="mb-2 justify-self-end mr-2">{items.carpet_area} sqft</div>
                    </div>
                    <div className="text-lg font-semibold mb-2">{items.name}</div>
                    <div className="flex lg:grid lg:grid-cols-2 items-center justify-between">
                        <div className="text-xl font-bold">60 Lac</div>
                        <button className="btn-view_details justify-self-end">View Details</button>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default ClassifiedsCard