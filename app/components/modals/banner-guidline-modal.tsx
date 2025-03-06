import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'

const BannerGuidlineModal = (props: any) => {
    return (
        <Modal isOpen={props.isOpen} size='5xl' onClose={props.onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Banner Image Guidline</ModalHeader>
                        <ModalBody>
                            <img src='/images/Banner_Ad_Guidline_Desc.jpg' />
                            <ul className='list-disc mx-5 text-sm md:text-base mt-3'>
                                <li>Ensure the minimum banner width to be 1536px with a height of 384px.</li>
                                <li>Please try to keep the main content in the center of banner within the width of 765px.</li>
                                <li>Following this dimenssions correctly will provide a better visibility and reach to your target customers through our website.</li>
                            </ul>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Undestood
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default BannerGuidlineModal