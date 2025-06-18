"use client"
import { signOut } from 'next-auth/react'
import React from 'react'

const Page = () => {
    signOut({ callbackUrl: '/' })
    return (
        <></>
    )
}

export default Page