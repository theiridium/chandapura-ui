import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useState } from 'react'
import Image from 'next/image'

const PaymentSuccessModal = (props: any) => {
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <Modal size='lg' hideCloseButton={true} isDismissable={false} defaultOpen={true}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className='mx-auto pt-5 pb-8'>
              <img src='/images/icons/green-tick.png' />
              <div className='mb-3'>Payment Successful</div>
              <Button isDisabled={isDisabled} color="primary" as={Link} href={props.url} onPress={() => setIsDisabled(true)}>
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