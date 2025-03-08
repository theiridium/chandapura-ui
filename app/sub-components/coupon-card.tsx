import React from 'react'

const CouponCard = () => {
    return (
        <div className="overflow-hidden rounded-lg mb-2">
            <div className="relative bg-white rounded-lg px-6 border border-dashed border-gray-400">
                <div className="absolute -left-4 top-8 w-8 h-10 bg-white rounded-r-full border border-dashed border-gray-400"></div>
                <div className="absolute -right-4 top-8 w-8 h-10 bg-white rounded-l-full border border-dashed border-gray-400"></div>

                <h2 className="text-lg font-bold text-gray-800 text-center py-3 border-b border-dashed border-gray-400">EXTRA30</h2>
                <p className="text-gray-600 text-center text-sm py-3">Get 30 extra days FREE on your monthly plan! - Offer Limited</p>
            </div>
        </div>
    )
}

export default CouponCard