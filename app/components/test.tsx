"use client"
import { UpdateSubCategories, UploadSubCategories } from '@/lib/helpers'
import React from 'react'

const Test = () => {
  return (
    <div>
        <button onClick={() => UpdateSubCategories()}>UploadSubCategories</button>
    </div>
  )
}

export default Test