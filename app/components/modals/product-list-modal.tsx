"use client"
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { usePathname, useSearchParams } from 'next/navigation';

const ProductListModal = (props: any) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const onClickAddNew = (onClose: any) => {
        confirm('Are you sure you want to leave this page?')
        window.location.replace(pathname)
        onClose()
    }
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-row items-center justify-between gap-1 px-8">
                            <h4>{props.title}</h4>
                            <Button color="primary" isDisabled={props.list.length === 0} variant="ghost" radius="sm" className='mr-5 hover:color-white' onPress={() => onClickAddNew(onClose)}>
                                Add New
                            </Button>
                        </ModalHeader>
                        <ModalBody className='px-8 gap-0 p-0 pb-5 divide-y'>
                            {props.list.length > 0 ? props.list.map((x: any, i: any) =>
                                <a className='py-5 px-8 hover:bg-slate-100' href={`${pathname}?type=edit&source=${x.id}`} key={i}>{x.name}</a>
                            ) :
                                <p className='py-5 px-8'>No items in list</p>}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ProductListModal