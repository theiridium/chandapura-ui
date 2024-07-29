import React from 'react'

const BusinessListLoading = () => {
    let el = []
    for (let i = 0; i < 3; i++) {
        el.push(
            <div key={i} className="re-card-link">
                <div className="business-card">
                    <div className="business-card-img">
                        <img src="/images/placeholder.png" />
                    </div>
                    <div className="business-card-body">
                        <div className="h-[20px] bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-[24px] bg-gray-200 rounded w-full mb-2 truncate"></div>
                        <div className="h-[28px] bg-gray-200 rounded w-1/2 text-lg font-semibold mb-2 lg:mb-5"></div>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-x-10 gap-y-1">
                            <div className="h-[36px] bg-gray-200 rounded w-5 btn-contact grow flex justify-center items-center gap-x-2 mb-2 lg:mb-0 w-full lg:w-2/3"></div>
                            <div className="h-[36px] bg-gray-200 rounded w-5 btn-view_details text-center w-full lg:w-1/3"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className='business-card-list-row'>{el}</div>
    )
}

export default BusinessListLoading