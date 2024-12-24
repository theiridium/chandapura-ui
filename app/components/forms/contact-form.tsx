"use client"
import { ContactList } from '@/lib/typings/dto';
import { Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const ContactForm = ({ contactDetails, txtContactDisabled, defaultContact }: any) => {
    const handleFormChange = (e: any) => {
        contactDetails((prevState: any) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
            <div className='mb-6'>
                <Input type="text" isRequired={true} name="contact_name" variant="flat" label="Full Name" disabled={txtContactDisabled} value={defaultContact?.contact_name || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="text" minLength={10} maxLength={10} isRequired={true} name="contact_number" variant="flat" label="Phone Number" disabled={txtContactDisabled} value={defaultContact?.contact_number || ""} onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='mb-6'>
                <Input type="email" name="contact_email_id" variant="flat" label="Business Email ID" disabled={txtContactDisabled} value={defaultContact?.contact_email_id || ""} onChange={(e) => handleFormChange(e)} />
            </div>
        </>
    )
}

export default ContactForm