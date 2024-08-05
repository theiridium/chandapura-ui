"use client"
import { ContactList } from '@/lib/typings/dto';
import { Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const ContactForm = ({ contactDetails, txtContactDisabled }: any) => {
    const { data }: any = useSession();
    const userData = data?.user;
    const [contact, setContact] = useState<any>({ full_name: userData.name, phone: userData.phone, email_id: userData.email });
    const handleFormChange = (e: any) => {
        setContact((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    useEffect(() => {
        contactDetails(contact)
    }, [contact])
    
    return (
        <>
            <div className='mb-6'>
                <Input type="text" name="full_name" variant="flat" label="Full Name" disabled={txtContactDisabled} value={contact?.full_name || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" name="phone" variant="flat" label="Phone Number" disabled={txtContactDisabled} value={contact?.phone || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" name="email_id" variant="flat" label="Business Email ID" disabled={txtContactDisabled} value={contact?.email_id || ""} onChange={(e) => handleFormChange(e)} />
            </div>
        </>
    )
}

export default ContactForm