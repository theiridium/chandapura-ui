import TextMarquee from '@/app/sub-components/text-marquee'
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { DropdownList } from '@/public/shared/app.config';
import React from 'react'

const AreaMarquee = async () => {
    const attrArea = DropdownList.Area.api;
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}&pagination[pageSize]=100`;
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <TextMarquee data={resArea.data} />
    )
}

export default AreaMarquee