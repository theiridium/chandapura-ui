import { Resource } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'

const ContactButton = (props: any) => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const pageUrl = searchParams?`${pathname}?${searchParams}`: `${pathname}`;
    const [url, setUrl] = useState(Resource.Login.link + "?redirect=" + pageUrl);
    const [text, setText] = useState(`Contact ${props.maskedText}`);
    const session = useSession();
    useEffect(() => {
        if (session.status === "authenticated" || props.openContact) {
            setUrl(`tel:+91${props.phone}`);
            setText(`+91 ${props.phone}`);
        }
        else {
            setUrl(Resource.Login.link + "?redirect=" + pageUrl);
            setText(`Contact ${props.maskedText}`);
        }
    }, [])

    return (
        <>
            {(session.status === "authenticated" || props.openContact) && <div className='text-sm text-gray-500 font-semibold mb-4'>Contact Name: {props.name}</div>}
            <a className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full font-medium h-fit text-center flex items-center gap-x-2 text-sm md:text-medium w-fit" href={url}>{text}</a>
        </>
    )
}

export default ContactButton