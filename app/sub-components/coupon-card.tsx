import React from 'react'

const CouponCard = (props: any) => {
    return (
        <div className="overflow-hidden rounded-lg mb-2">
            <div className="relative bg-color1d/10 rounded-lg px-6 border border-dashed border-color1d">
                <div className="absolute -left-4 top-8 w-8 h-10 bg-white rounded-r-full border border-dashed border-color1d"></div>
                <div className="absolute -right-4 top-8 w-8 h-10 bg-white rounded-l-full border border-dashed border-color1d"></div>

                <h2 className="text-lg font-bold text-gray-800 text-center py-3 border-b border-dashed border-color1d">{props.couponCode}</h2>
                <p className="text-gray-600 text-center text-sm py-3">{props.couponDescription}</p>
            </div>
        </div>
    )
}

export default CouponCard