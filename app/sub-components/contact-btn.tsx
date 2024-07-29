import { Resource } from '@/public/shared/app.config';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react'

const ContactButton = (props: any) => {
    const [url, setUrl] = useState(Resource.Login.link);
    const [text, setText] = useState(`Conatct ${props.maskedText}`);
    const session = useSession();
    useEffect(() => {
        if (session.status === "authenticated") {
            setUrl(`tel:+91${props.phone}`);
            setText(`+91 ${props.phone}`);
        }
        else {
            setUrl(Resource.Login.link);
            setText(`Conatct ${props.maskedText}`);
        }
    }, [])

    return (
        <>
            {session.status === "authenticated" && <div className='text-sm text-gray-500 font-semibold mb-4'>Contact Name: {props.name}</div>}
            <a className="btn-primary block w-fit" href={url}>{text}</a>
        </>
    )
}

export default ContactButton