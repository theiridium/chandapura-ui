"use client"
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

const PaymentSuccessModal = (props: any) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  return (
    <Modal size='lg' hideCloseButton={true} isDismissable={false} defaultOpen={true}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className='mx-auto pt-5 pb-8'>
              <img src='/images/icons/green-tick.png' />
              <div className='mb-3'>Payment Successful</div>
              <Button isDisabled={isDisabled} color="primary" onPress={() => {
                setIsDisabled(true);
                router.push(props.url)
              }}>
                Go to Dashboard
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default PaymentSuccessModal