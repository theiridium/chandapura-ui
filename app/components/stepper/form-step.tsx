import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

const FormStep = ({ steps }: any) => {
    const pathname = usePathname();
    const segments: any = pathname.split("/");
    let flag = false;
    return (
        <ol className="relative grid grid-cols-4 lg:flex lg:justify-normal lg:flex-col gap-x-5 lg:gap-y-16 text-gray-500 border-t lg:border-t-0 lg:border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
            {steps.map((x: any, i: any) => {
                let matchedRoute: any = (Object.values(steps).find((x: any) => segments.includes(x.currentPath)) as any)?.number;
                if (x.number === 1 && segments.includes(x.currentPath)) flag = false;
                else {
                    if (i < matchedRoute - 1) flag = true;
                    else flag = false;
                }
                return (<li key={x.number} className="mt-6 lg:mt-0 lg:-ms-4 relative">
                    {flag ?
                        <span className="font-bold absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 lg:translate-y-0 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -top-6 lg:top-0 ring-4 bg-green-200 ring-white dark:ring-gray-900 dark:bg-green-900">
                            <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                        </span> :
                        <span className="font-bold absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 lg:translate-y-0 flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -top-6 lg:top-0 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                            {x.number}
                        </span>
                    }
                    <div className="font-medium text-xs lg:text-base text-center lg:text-left lg:ms-14">{x.title}</div>
                </li>)
            }
            )}
        </ol>
    )
}

export default FormStep