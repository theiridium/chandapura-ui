import React from 'react'

const ZeroListingCard = ({ dashLink, title }: any) => {
    return (
        <a className="card_link" href={dashLink}>
            <div className="border border-gray-300 border-2 border-dashed rounded-md bg-white flex justify-center items-center py-10 px-5">
                <div className="self-center text-center text-gray-500 font-semibold">
                    <div>No {title} found for this search</div>
                    <div className='text-xl'>Click to Add your own lisitng</div>
                </div>
            </div>
        </a>
    )
}

export default ZeroListingCard