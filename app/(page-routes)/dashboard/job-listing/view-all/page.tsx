"use client"
import AlertModal from '@/app/components/modals/alert-modal';
import FormLoading from '@/app/loading-components/form-loading';
import Breadcrumb from '@/app/sub-components/breadcrumb';
import { getPublicApiResponse, putRequestApi } from '@/lib/apiLibrary';
import { ConvertToReadableDate } from '@/lib/helpers';
import { ListingWorkflow } from '@/lib/typings/enums';
import { DropdownList, Products, Resource } from '@/public/shared/app.config';
import { Button, Link, useDisclosure } from "@heroui/react";
import { CalendarCheck, MapPin, MoveRight, Pencil, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const steps = [
  {
    number: 1,
    title: "Job Details",
    currentPath: "add-details",
    nextPath: "upload-images"
  },
  {
    number: 2,
    title: "Upload Images",
    currentPath: "upload-images",
    nextPath: "review"
  },
  {
    number: 3,
    title: "Review",
    currentPath: "review",
    nextPath: "payment"
  },
  {
    number: 4,
    title: "Payment",
    currentPath: "payment",
    nextPath: "publish"
  }
]
const Page = () => {
  const addNewUrl = "/dashboard/job-listing/add-details?type=new";
  const router = useRouter();
  const attr = DropdownList.JobList.api;
  const { data }: any = useSession();
  const user = data?.user;
  const [list, setList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [itemId, setItemId] = useState<any>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const getJobList = async () => {
    let apiUrl = `${attr.base}?sort=${attr.sortByDate}&${attr.filter}=${user?.email}&${attr.populate}`
    const response = await getPublicApiResponse(apiUrl);
    setList(response.data);
    setIsLoading(false);
  }
  useEffect(() => {
    getJobList();
  }, [])
  const onClickBtnSold = (id: any) => {
    onOpen();
    setItemId(id);
  }
  const markAsHired = async () => {
    try {
      let payload = {
        publish_status: false,
        isUnlisted: true
      }
      const endpoint = Products.job.api.base;
      const response = await putRequestApi(endpoint, payload, itemId);
      if (response.data) {
        getJobList();
        return true;
      }
    } catch (error) {
      console.error("An error occurred during the process:", error);
      toast.error("An error occurred. Please contact our support team.");
    }
  }

  return (
    <div className='max-w-screen-xl min-h-screen mx-auto px-3 my-8 md:mt-8 md:mb-10'>
      <div className='flex gap-8 justify-between md:justify-normal items-center mb-8 md:mb-12'>
        <h1 className="dash-heading">My Job Listings</h1>
        <Button color="primary" variant="ghost" size='sm' radius="sm" className='hover:color-white'
          onPress={() => {
            setIsRedirecting(true);
            router.push(addNewUrl)
          }}
          startContent={<Plus size={20} />}>
          <span className='hidden md:block'>Add New</span>
        </Button>
      </div>
      <Breadcrumb blockSecondLast={false} />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-10'>
        {isLoading || isRedirecting ?
          (isLoading ? <FormLoading text={"Loading your Job Vacancy List..."} /> :
            <FormLoading text={"Taking you to the Job Vacancy Form page..."} />
          ) :
          list.length > 0 ?
            !isLoading && list.map((x: any, i: any) => {
              let continueUrl = "";
              if (!x.publish_status) {
                let baseUrl = steps.find(({ number }) => number === x.step_number)?.nextPath;
                continueUrl = `${Resource.JobListing.baseLink}/${baseUrl}?type=new&source=${x.id}`
              }
              // const renewUrl = `${Resource.JobListing.baseLink}/payment?type=renew&source=${x.id}`;
              return (
                <div key={i} className={`relative overflow-hidden py-10 md:px-5 border-b-1 md:border md:rounded-lg ${x.isUnlisted && 'md:bg-overlay/10'} ${i === 0 && 'border-t-1'}`}>
                  <div className="flex gap-5 md:gap-10 relative">
                    <div className='dash-card-top'>
                      {x.publish_status ?
                        <div className='flex items-center gap-3'>
                          <Button as={Link} className='btn-vis' color='secondary' variant='flat' size='sm' href={`/${Products.job.slug}/${x.category.toLowerCase()}/${x.slug}?source=${x.id}`} endContent={<MoveRight size={15} />}>View in Site</Button>
                          <div className='pill-active'>Active</div>
                        </div> :
                        <>
                          {!x.isUnlisted && ((x.step_number === ListingWorkflow.Payment && !x.publish_status) ? <div className='pill-pendingApproval'>Pending Approval</div> :
                            <div className='pill-draft'>Draft</div>
                          )}
                        </>
                      }
                    </div>
                    <div className='flex *:basis-24 *:w-[145px] *:h-[150px] *:object-cover *:rounded-lg'>
                      {x.logo_image === null ?
                        <img src="/images/icons/company-logo-placeholder.png" /> :
                        <img src={x.logo_image.url} />}
                    </div>
                    <div className='w-full grow'>
                      <div className='grid grid-cols-1 h-full content-between'>
                        <div>
                          <div className='font-semibold md:text-2xl mb-1'>{x.job_title}</div>
                          <div className='text-gray-500 font-medium mb-1'>{x.name}</div>
                          <div className='text-xs flex flex-col md:flex-row md:items-center gap-1 md:gap-5 *:flex *:items-center'>
                            <div><MapPin size={10} className='mr-1' />{x.area.name}</div>
                            <div><CalendarCheck size={10} className='mr-1' />Posted on {ConvertToReadableDate(new Date(x.publishedAt))}</div>
                          </div>
                        </div>
                        {x.isUnlisted && <div className='text-md mt-4 flex items-center'>Hired on {ConvertToReadableDate(new Date(x.updatedAt))}</div>}
                        {!x.isUnlisted &&
                          <>
                            {x.publish_status && <div className='flex'>
                              <Button className='w-full md:w-auto h-6' color='success' variant='flat' size='sm' onPress={() => onClickBtnSold(x.id)}>Mark as Hired</Button>
                            </div>
                            }
                            <>
                              <div className='flex text-[0.6rem] xs:text-sm border-y-1 divide-x *:px-2 *:py-1 *:flex *:items-center *:grow *:justify-center *:gap-x-1 text-color1d'>
                                {x.publish_status ? <>
                                  <a className='hover:bg-color2d/20' href={Resource.JobListing.addDetailsLink + '?type=edit&source=' + x.id}>Job Profile<Pencil size={15} /></a>
                                  <a className='hover:bg-color2d/20' href={Resource.JobListing.uploadImagesLink + '?type=edit&source=' + x.id}>Image<Pencil size={15} /></a>
                                </> :
                                  <>
                                    {!x.publish_status && x.step_number === 4 ? <div>Pending Approval from Admin</div> : <a className='hover:bg-color2d/20' href={continueUrl}>Continue to complete listing<MoveRight size={15} /></a>}
                                  </>
                                }
                              </div>
                            </>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                  {x.isUnlisted &&
                    <div className='ribbon-sold'>HIRED</div>
                  }
                  {!!x.category &&
                    <div className='ribbon-job_category'>{x.category}</div>
                  }
                </div>
              )
            }) :
            <p className='text-lg'>Your list is empty, click on <a className='link-text' href={addNewUrl}>Add New</a> to start listing your job vacancy today.</p>}
      </div>
      <AlertModal isOpen={isOpen} onOpenChange={onOpenChange} updateItemStatus={markAsHired}
        bodyContent="Are you sure you want to mark this job as Hired?" />
    </div>
  )
}

export default Page