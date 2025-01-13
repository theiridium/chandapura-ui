'use client'
import ImageGallery from '@/app/components/modals/image-gallery';
import { useDisclosure } from '@nextui-org/react';
import { IndianRupee, Phone } from 'lucide-react';
import ViewLocationMap from '@/app/components/maps/view-location-map';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import ContactButton from '@/app/sub-components/contact-btn';
import ContactCard from '@/app/sub-components/contact-card';
import { ConvertCurrencyToWords } from '@/lib/helpers';

const JobDetail = ({ data }: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div>
      <ImageGallery isOpen={isOpen} onOpenChange={onOpenChange} list={data.gallery_images} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
        <div className="lg:col-span-3">
          <div className="lg:border border-gray-300 rounded-xl bg-white lg:p-7 gap-x-5 lg:gap-x-7">
            <div>
              <div className='grid lg:grid-rows-2 lg:grid-cols-7 gap-5 lg:gap-7 lg:mb-12'>
                <div className={`${data.gallery_images ? 'row-span-2 col-span-4 lg:col-span-5' : 'row-span-2 col-span-4 lg:col-span-full'}`}>
                  {data.featured_image &&
                    <div className='relative'>
                      <img src={data.featured_image.url} className="w-full h-[250px] lg:h-[380px] lg:rounded-xl object-cover" />
                      {data.gallery_images &&
                        <div className='absolute bottom-3 right-3 rounded-md bg-black/50 hover:bg-black/40 w-fit px-3 py-1 text-white cursor-pointer' onClick={onOpen}>{data.gallery_images.length + 1} Photos</div>
                      }
                    </div>
                  }
                </div>
                {data.gallery_images &&
                  <div className="hidden lg:block col-span-2">
                    <img src={data.gallery_images[0].url} className="w-full h-full rounded-xl object-cover" />
                  </div>
                }
                {data.gallery_images && data.gallery_images.length > 2 ?
                  <div className="hidden lg:block col-span-2 cursor-pointer relative" onClick={onOpen}>
                    <img src={data.gallery_images[1].url} className="w-full h-full rounded-xl object-cover" />
                    <div className="w-full h-full rounded-xl bg-black/50 hover:bg-black/40 absolute top-0 left-0 flex">
                      <span className='text-white text-[3.25rem] m-auto font-light'>+{data.gallery_images.length - 2}</span>
                    </div>
                  </div> :
                  <div className="hidden lg:block col-span-2">
                    {data.gallery_images && data.gallery_images[1] &&
                      <img src={data.gallery_images[1].url} className="w-full h-full rounded-xl object-cover" />
                    }
                  </div>
                }
              </div>
              <div className='p-5 lg:p-0'>
                <div className='re-header flex-none lg:flex justify-between mb-12'>
                  <div className="lg:hidden"><Breadcrumb blockSecondLast={true} /></div>
                  <div>
                    <h1 className="md:text-xl font-medium text-gray-500 mb-5"><span className='text-highlight'>{data.category.name}</span> for Sale in {data.area.name}</h1>
                    <h2 className="font-semibold text-xl lg:text-3xl">{data.name}</h2>
                  </div>
                  <div className='text-2xl font-semibold text-gray-600 flex items-center bg-color2d/70 px-5 py-1 mt-0 lg:mt-5 lg:mt-0 w-fit float-right lg:float-none'><IndianRupee strokeWidth={3} size={20} />{ConvertCurrencyToWords(data.sale_amount)}</div>
                </div>
                <div className='mb-12'>
                  <ContactButton name={data.contact.contact_name} phone={data.contact.contact_number} maskedText={"Owner"} />
                </div>
                {data.description &&
                  <>
                    <hr />
                    <div className='py-12'>
                      <div className='text-sm text-gray-500 font-semibold'>Description</div>
                      <p className='text-sm md:text-lg font-medium'>{data.description}</p>
                    </div>
                  </>}
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-1 relative m-5 lg:m-0'>
          <ContactCard heading="Owner Contact Details" name={data.contact.contact_name} contact={data.contact.contact_number} />
        </div>
      </div>
    </div>
  )
}

export default JobDetail