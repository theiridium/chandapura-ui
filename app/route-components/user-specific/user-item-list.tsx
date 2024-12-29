"use client"
import ProductListModal from '@/app/components/modals/product-list-modal';
import { getPublicApiResponse } from '@/lib/apiLibrary';
import { Button, useDisclosure } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const UserItemList = (props: any) => {
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const source = searchParams.get('source');
    const { data }: any = useSession();
    const userData = data?.user;
    const [list, setList] = useState<any>([]);
    const [name, setName] = useState<any>("Add New");
    const [isLoading, setIsLoading] = useState(true);
    const [disableBtn, setDisableBtn] = useState(false);
    const getResult = async () => {
        let apiUrl = `${props.attr.base}?sort=${props.attr.sortByName}&${props.attr.filter}=${userData?.email}`
        const response = await getPublicApiResponse(apiUrl);
        const filteredData = response.data.filter((x: any) => x.id.toString() === source)[0];
        setList(response);
        (filteredData && source) && setName(filteredData.name)
        setIsLoading(false);
    }
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    useEffect(() => {
        getResult();
    }, [])
    useEffect(() => {
        setDisableBtn(!(pathname.includes('add-details') && !pathname.includes('upload-images')));
    }, [pathname])

    return (
        <div className='mb-10'>
            <Button isDisabled={isLoading || disableBtn} radius="sm" onPress={onOpen} className='justify-between' fullWidth={true} size='lg' endContent={<ChevronDown />}>
                {name}
            </Button>
            <ProductListModal isOpen={isOpen} onOpenChange={onOpenChange} title={props.title} list={list.data} />
        </div>
    )
}

export default UserItemList