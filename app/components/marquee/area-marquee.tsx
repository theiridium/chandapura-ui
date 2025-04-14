import MarqueeTextLoading from '@/app/loading-components/marquee-text-loading';
import MarqueeText from '@/app/sub-components/marquee-text'
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { DropdownList } from '@/public/shared/app.config';
import React, { Suspense } from 'react'

const AreaMarquee = async () => {
    const attrArea = DropdownList.Area.api;
    let apiUrlArea = `${attrArea.base}?sort=${attrArea.sort}&pagination[pageSize]=100`;
    const resArea = await getPublicApiResponse(apiUrlArea);
    return (
        <Suspense fallback={<MarqueeTextLoading />}>
            <MarqueeText data={resArea.data} />
        </Suspense>
    )
}

export default AreaMarquee