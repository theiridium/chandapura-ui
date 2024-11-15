import { Skeleton } from "@nextui-org/react"

const GlobalSearchListLoading = () => {
    return (
        <div className="grid lg:grid-cols-4 lg:gap-10">
            <div className="col-span-3">
                <div className="grid grid-cols-1 gap-4 lg:gap-8 mb-4 lg:mb-10">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="border border-gray-300 rounded-xl bg-white">
                            <div className="flex-none md:flex p-5 lg:p-7 gap-x-5 lg:gap-x-7">
                                <Skeleton className="rounded-xl flex-none w-full h-[230px] lg:w-[300px] lg:h-[200px] mb-5 md:mb-0 *:object-fill">
                                    <div className="w-full h-full flex-none md:mb-0"></div>
                                </Skeleton>
                                <div className="w-full flex flex-col">
                                    <Skeleton className="w-4/5 rounded-lg mb-2">
                                        <div className="h-8 w-4/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-3/5 rounded-lg mb-3">
                                        <div className="h-5 w-3/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-2/5 rounded-lg mb-3">
                                        <div className="h-4 w-2/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-3/5 rounded-lg mb-3">
                                        <div className="h-6 w-3/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                    <Skeleton className="w-1/5 rounded-lg">
                                        <div className="h-6 w-1/5 rounded-lg bg-default-200"></div>
                                    </Skeleton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GlobalSearchListLoading