"use client"
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import ImageSlider from '@/app/sub-components/image-slider';

const ImageGallery = (props: any) => {
  return (
    <Modal className='modal-close-btn bg-black' disableAnimation={true} placement='center' isOpen={props.isOpen} onOpenChange={props.onOpenChange} size='full'>
      <ModalContent>
        <ModalBody className='px-8 gap-0 p-0 divide-y'>
          <ImageSlider imageProp={props.list} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ImageGallery