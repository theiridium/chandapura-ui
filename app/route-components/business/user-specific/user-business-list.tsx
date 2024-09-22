"use client"
import ProductListModal from '@/app/components/modals/product-list-modal';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { DropdownList } from '@/public/shared/app.config';
import { Button, useDisclosure } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const UserBusinessList = () => {
    const searchParams = useSearchParams();
    const source = searchParams.get('source');
    const attr = DropdownList.BusinessList.api;
    const { data }: any = useSession();
    const user = data?.user;
    const [list, setList] = useState<any>([]);
    const [name, setName] = useState<any>("Add New");
    const [isLoading, setIsLoading] = useState(true);
    const getBusinessList = async () => {
        let apiUrl = `${attr.base}?sort=${attr.sortByName}`
        const response = await getPublicApiResponse(apiUrl);
        const filteredData = response.data.filter((x: any) => x.id.toString() === source)[0];
        setList(response);
        (filteredData && source) && setName(filteredData.name)
        setIsLoading(false);
    }
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    useEffect(() => {
        getBusinessList();
    }, [])

    return (
        <div className='mb-10'>
            <Button isDisabled={isLoading} radius="sm" onPress={onOpen} className='justify-between' fullWidth={true} size='lg' endContent={<ChevronDown />}>
                {name}
            </Button>
            <ProductListModal isOpen={isOpen} onOpenChange={onOpenChange} title={"Select Business"} list={list.data} />
        </div>
    )
}

export default UserBusinessList