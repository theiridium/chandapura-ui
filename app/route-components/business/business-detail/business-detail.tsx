import ImageGallery from '@/app/components/modals/image-gallery';
import Map from '@/app/sub-components/map';
import { Button, useDisclosure } from '@nextui-org/react';
import { Phone } from 'lucide-react';
import { useEffect } from 'react';

const BusinessDetail = ({ data }: any) => {
  const contactName = `${data.user.first_name} ${data.user.last_name}`;
  console.log(data)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // useEffect(() => {
  //   getBusinessList();
  // }, [])
  return (
    <div>
      {/* <Button radius="sm" onPress={onOpen} className='justify-between' fullWidth={true} size='lg'>
        yo
      </Button > */}
      {/* <ImageGallery isOpen={isOpen} onOpenChange={onOpenChange} title={"Select Business"} list={data.gallery_images} /> */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10 text-gray-700">
        <div className="lg:col-span-3">
          <div className="border border-gray-300 rounded-xl bg-white p-5 lg:p-7 gap-x-5 lg:gap-x-7">
            <div className='grid lg:grid-rows-2 lg:grid-cols-7 gap-5 lg:gap-7 mb-12'>
              <div className="row-span-2 col-span-4 lg:col-span-5">
                {data.featured_image === null ?
                  <img src="/images/placeholder.png" className="w-full h-[250px] lg:h-[380px] rounded-xl" /> :
                  <img src={data.featured_image.url} className="w-full h-[250px] lg:h-[380px] rounded-xl" />
                }
              </div>
              <div className="col-span-2">
                {data.gallery_images[0] ?
                  <img src={data.gallery_images[0].url} className="w-full h-full rounded-xl" /> :
                  <img src="/images/placeholder.png" className="w-full h-full rounded-xl" />
                }
              </div>
              <div className="col-span-2">
                {data.gallery_images[1] ?
                  <img src={data.gallery_images[1].url} className="w-full h-full rounded-xl" /> :
                  <img src="/images/placeholder.png" className="w-full h-full rounded-xl" />
                }
              </div>
            </div>
            <div className='re-header flex-none lg:flex justify-between mb-12'>
              <div>
                <h1 className="text-lg lg:text-xl font-medium text-gray-500 mb-5"><span className='text-highlight'>{data.sub_category.name}</span> in {data.area}</h1>
                <h2 className="font-extrabold text-2xl lg:text-3xl">{data.name}</h2>
              </div>
            </div>
            <div className='mb-12'>
              <div className='text-sm text-gray-500 font-semibold'>Address</div>
              <p className='text-lg font-medium'>{data.full_address}</p>
              {/* <p className='text-lg font-medium'>Bangalore 562106, Karnataka</p> */}
            </div>
            <div className='mb-12'>
              <div className='text-sm text-gray-500 font-semibold mb-2'>Business Contact Name: <span className='text-black font-semibold'>{data.bus_contact.full_name}</span></div>
              <button className="border-2 border-color1d bg-color1d text-white px-5 py-1 rounded-full font-semibold h-fit text-center flex items-center gap-x-2"><Phone size={18} fill='#fff' stroke='none' />+91 {data.bus_contact.phone}</button>
            </div>
            <hr className='mb-12' />
            <div className='mb-12'>
              <div className='text-sm text-gray-500 font-semibold'>Description</div>
              <p className='text-lg font-medium'>{data.description}</p>
            </div>
            <hr className='mb-12' />
            <div className='mb-12'>
              <div className='text-sm text-gray-500 font-semibold'>Timings</div>
              {/* <p className='text-lg font-medium'>Mon-Sun 10:30 am - 5:00 pm</p> */}
              {/* <div className='grid grid-cols-3'>
              </div> */}
              <table className='table-auto text-center divide-y w-full'>
                <thead>
                  <tr className='*:py-3'>
                    <th></th>
                    <th></th>
                    <th>Opening Time</th>
                    <th></th>
                    <th>Closing Time</th>
                  </tr>
                </thead>
                <tbody className='text-lg font-medium divide-y'>
                  {data.bus_hours.map((x: any, i: any) =>
                    <tr className='*:py-3' key={i}>
                      <td className='text-left'>{x.day}</td>
                      <td><span className={`${x.isOpen ? 'bg-green-400' : 'bg-red-400'} text-white px-3 py-1 rounded-full`}>{x.isOpen ? "Open" : "Closed"}</span></td>
                      {x.isOpen &&
                        <>
                          <td>{x.open_time[0].toString()}</td>
                          <td>TO</td>
                          <td>{x.close_time[0].toString()}</td>
                        </>
                      }
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <hr className='mb-12' />
            <div className='mb-12'>
              <h5 className='text-sm text-gray-500 font-semibold mb-5'>Services</h5>
              {data.services && <div className="tags">
                {data.services.map((x: any, i: any) =>
                  <div className="px-4 py-1 bg-color2d/70 font-semibold rounded-full text-sm text-nowrap text-gray-600" key={i}>{x.trim()}</div>
                )}
              </div>}
            </div>
            <hr className='mb-12' />
            <div className='mb-12'>
              <h5 className='text-sm text-gray-500 font-semibold mb-5'>Map Location</h5>
              <Map />
            </div>
          </div>
        </div>
        {/* <div className='lg:col-span-1 relative'>
          <ContactCard heading="Owner Contact Details" name={contactName} contact={data.user.phone} />
        </div> */}
      </div>
    </div>
  )
}

export default BusinessDetail