import React from 'react'

const ItemListLoading = () => {
    return (
        <div className="card-list-row">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='re-card-link'>
                    <div className="re-card">
                        <div className="re-card-img">
                            <img src="/images/placeholder.png" className="w-full h-full" />
                        </div>
                        <div className="re-card-body">
                            <div className="h-[20px] bg-gray-200 rounded w-14 text-xs font-bold mb-2 flex items-center"></div>
                            <div className="text-sm md:text-base flex items-center justify-between mb-2 text-slate-600">
                                <div className="h-[20px] bg-gray-200 rounded w-14 justify-self-end mr-2"></div>
                                <div className="h-[20px] bg-gray-200 rounded w-14 justify-self-end mr-2"></div>
                            </div>
                            <div className="h-[24px] bg-gray-200 rounded text-base md:text-lg font-semibold mb-2 truncate text-slate-600"></div>
                            <div className="h-[28px] bg-gray-200 rounded flex items-center justify-between"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ItemListLoading