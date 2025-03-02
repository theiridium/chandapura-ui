import { Button, Link } from '@nextui-org/react'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="max-w-screen-xl mx-auto lg:px-3 lg:my-6">
      <div className='flex justify-center mb-5'>
        <div>
          <Image src='/images/404_img.jpg' width={800} height={400} alt='404' />
          <div className='text-center'>
            <Button variant='solid' color='primary' size='lg' radius='full' as={Link} href='/'>Go Back to Home Page</Button>
          </div>
        </div>
      </div>
    </div>
  )
}