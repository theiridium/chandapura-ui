import { Button, Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import React from 'react'

const AlertModal = (props: any) => {
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} size='2xl'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalBody className='p-8 divide-y'>
                            <p>{props.text}</p>
                            <Button className='m-auto w-fit-content my-4' color='primary' onPress={onClose}>
                                OK
                            </Button>
                            <p className='text-sm text-red-500'>* Please check your spam box in case you do not find the email in your inbox.</p>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AlertModal