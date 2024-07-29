import React from 'react'

const ItemListLoading = () => {
    let el = []
    for (let i = 0; i < 4; i++) {
        el.push(
            <div key={i} className="border rounded-md bg-white">
                <div className="border-b h-40 w-72 lg:w-auto">
                    <img src="/images/placeholder.png" className="w-full h-full" />
                </div>
                <div className="px-4 lg:px-6 h-40 grid content-center">
                    <div className="grid grid-cols-2">
                        <div className="h-[20px] bg-gray-200 rounded w-14 mb-2"></div>
                        <div className="h-[20px] bg-gray-200 rounded w-14 mb-2 justify-self-end mr-2"></div>
                    </div>
                    <div className="h-[24px] bg-gray-200 rounded w-28 mb-2"></div>
                    <div className="flex lg:grid lg:grid-cols-2 items-center justify-between">
                        <div className="h-[28px] bg-gray-200 rounded w-16"></div>
                        <button className="btn-view_details justify-self-end invisible">View Details</button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="card-list-row">{el}</div>
    )
}

export default ItemListLoading