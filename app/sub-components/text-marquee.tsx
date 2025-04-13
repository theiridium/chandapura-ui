'use client'
import React from 'react'
import Marquee from "react-fast-marquee";

const TextMarquee = ({ data }: any) => {
    return (
        <Marquee className='py-5 bg-color1d/10 text-color1d' pauseOnClick={true} pauseOnHover={true} autoFill={true}>
            {data.map((x: any, i: any) =>
                <div className='px-3' key={i}>
                    {x.name}
                </div>
            )}
        </Marquee>
    )
}

export default TextMarquee