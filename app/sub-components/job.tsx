import { MapPin } from 'lucide-react';
import { IndianRupee } from 'lucide-react';

const Job = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-3 mb-20">
      <h2 className="category-title mb-7">Job Vacancy</h2>
      <div className="grid grid-cols-3 gap-5">
        <div className="border rounded-md bg-color1d h-44 text-white p-4">
          <div className="grid grid-cols-2 mb-4">
            <div className="flex gap-x-3">
              <div className="w-10 h-10">
                <img src="/images/placeholder.png" className="w-full h-full" />
              </div>
              <div>
                <div className="text-lg leading-5 font-bold">Store Manager</div>
                <div className="text-sm">Big Market</div>
              </div>
            </div>
            <div className="justify-self-end">
              <button className="btn-view_details bg-color2d/90 hover:bg-color2d justify-self-end">View Details</button>
            </div>
          </div>
          <div className='flex items-center gap-x-1 mb-1'>
            <MapPin size={18} />
            <div>Marasuru, Anekal Main Road</div>
          </div>
          <div className='flex items-center gap-x-1 mb-2'>
            <IndianRupee size={18} />
            <div>30,000 - 40,000</div>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='bg-white/20 px-2'>Experienced</div>
            <div className='bg-white/20 px-2'>On-Field</div>
            <div className='bg-white/20 px-2'>Full Time</div>
          </div>
        </div>
        <div className="border rounded-md bg-color1d h-44 text-white p-4">
          <div className="grid grid-cols-2 mb-4">
            <div className="flex gap-x-3">
              <div className="w-10 h-10">
                <img src="/images/placeholder.png" className="w-full h-full" />
              </div>
              <div>
                <div className="text-lg leading-5 font-bold">Store Manager</div>
                <div className="text-sm">Big Market</div>
              </div>
            </div>
            <div className="justify-self-end">
              <button className="btn-view_details bg-color2d/90 hover:bg-color2d justify-self-end">View Details</button>
            </div>
          </div>
          <div className='flex items-center gap-x-1 mb-1'>
            <MapPin size={18} />
            <div>Marasuru, Anekal Main Road</div>
          </div>
          <div className='flex items-center gap-x-1 mb-2'>
            <IndianRupee size={18} />
            <div>30,000 - 40,000</div>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='bg-white/20 px-2'>Experienced</div>
            <div className='bg-white/20 px-2'>On-Field</div>
            <div className='bg-white/20 px-2'>Full Time</div>
          </div>
        </div>
        <div className="border rounded-md bg-color1d h-44 text-white p-4">
          <div className="grid grid-cols-2 mb-4">
            <div className="flex gap-x-3">
              <div className="w-10 h-10">
                <img src="/images/placeholder.png" className="w-full h-full" />
              </div>
              <div>
                <div className="text-lg leading-5 font-bold">Store Manager</div>
                <div className="text-sm">Big Market</div>
              </div>
            </div>
            <div className="justify-self-end">
              <button className="btn-view_details justify-self-end">View Details</button>
            </div>
          </div>
          <div className='flex items-center gap-x-1 mb-1'>
            <MapPin size={18} />
            <div>Marasuru, Anekal Main Road</div>
          </div>
          <div className='flex items-center gap-x-1 mb-2'>
            <IndianRupee size={18} />
            <div>30,000 - 40,000</div>
          </div>
          <div className='flex items-center gap-x-2'>
            <div className='bg-white/20 px-2'>Experienced</div>
            <div className='bg-white/20 px-2'>On-Field</div>
            <div className='bg-white/20 px-2'>Full Time</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Job