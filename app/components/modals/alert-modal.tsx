"use client"
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react"
import React, { useState } from 'react'

const AlertModal = (props: any) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} hideCloseButton={true} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className='p-5'>
                            <p className='text-center text-sm'>
                                {props.bodyContent}
                            </p>
                            <div className='flex items-center justify-center gap-5'>
                                <Button color="danger" size='sm' variant="flat" onPress={onClose} isDisabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button color="primary" size='sm' isLoading={isLoading} onPress={async () => {
                                    setIsLoading(true);
                                    !!(await props.updateItemStatus()) && onClose()
                                }}>
                                    Yes
                                </Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default AlertModal