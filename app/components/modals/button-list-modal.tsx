"use client"
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const ButtonListModal = (props: any) => {
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className='p-8 gap-5'>
                            {props.btnComp}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ButtonListModal