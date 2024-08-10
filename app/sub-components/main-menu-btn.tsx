import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const MainMenuBtn = ({url}: any) => {
  return (
    <Link className='flex hover:underline underline-offset-4 hover:text-color1d' href={url}><ChevronLeft className='mr-2' />View All List</Link>
  )
}

export default MainMenuBtn